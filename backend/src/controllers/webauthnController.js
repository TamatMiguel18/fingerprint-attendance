const { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } = require('@simplewebauthn/server');
const User = require('../models/User');

const rpName = 'Fingerprint Attendance';
const rpID = 'localhost'; // Should match the domain where the app is hosted
const origin = `http://${rpID}:5173`; // Vite default port

// In-memory store for challenges
const userChallenges = {};

// 1. Generate Registration Options (When Admin adds a fingerprint for a student)
const generateRegistration = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userPasskeys = await User.getPasskeysByUserId(userId);

        const options = await generateRegistrationOptions({
            rpName,
            rpID,
            userID: new Uint8Array(Buffer.from(user.id.toString(), 'utf8')),
            userName: user.email,
            timeout: 60000,
            attestationType: 'none',
            excludeCredentials: userPasskeys.map(passkey => ({
                id: passkey.credential_id,
                transports: JSON.parse(passkey.transports || '[]'),
            })),
            authenticatorSelection: {
                residentKey: 'preferred',
                userVerification: 'preferred',
            },
        });

        // Store the challenge for this user
        userChallenges[userId] = options.challenge;

        res.json(options);
    } catch (error) {
        console.error("Generate Registration Error:", error);
        res.status(500).json({ message: "Error generating registration options" });
    }
};

// 2. Verify Registration Response
const verifyRegistration = async (req, res) => {
    const { userId } = req.params;
    const { body } = req;

    const expectedChallenge = userChallenges[userId];

    if (!expectedChallenge) {
        return res.status(400).json({ message: "Challenge not found or expired" });
    }

    try {
        const verification = await verifyRegistrationResponse({
            response: body,
            expectedChallenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
        });

        const { verified, registrationInfo } = verification;

        if (verified && registrationInfo) {
            const { credential } = registrationInfo;

            // Save the passkey to the DB
            await User.saveWebAuthnPasskey(
                userId,
                userId.toString(),
                credential.id,
                Buffer.from(credential.publicKey).toString('base64url'),
                credential.counter,
                credential.transports || []
            );

            delete userChallenges[userId];
            res.json({ verified: true });
        } else {
            res.status(400).json({ verified: false, message: "Verification failed" });
        }
    } catch (error) {
        console.error("Verify Registration Error:", error);
        res.status(400).json({ verified: false, message: error.message });
    }
};

// 3. Generate Authentication Options (When a student scans to mark attendance)
const generateAuthentication = async (req, res) => {
    const { userId } = req.params;

    try {
        const userPasskeys = await User.getPasskeysByUserId(userId);
        
        if (!userPasskeys || userPasskeys.length === 0) {
            return res.status(404).json({ message: "No fingerprints registered for this user." });
        }

        const options = await generateAuthenticationOptions({
            rpID,
            timeout: 60000,
            allowCredentials: userPasskeys.map(passkey => ({
                id: passkey.credential_id,
                transports: JSON.parse(passkey.transports || '[]'),
            })),
            userVerification: 'preferred',
        });

        userChallenges[userId] = options.challenge;

        res.json(options);
    } catch (error) {
        console.error("Generate Authentication Error:", error);
        res.status(500).json({ message: "Error generating authentication options" });
    }
};

// 4. Verify Authentication Response (Mark Attendance)
const verifyAuthentication = async (req, res) => {
    const { userId, activityId } = req.params;
    const { body } = req;

    const expectedChallenge = userChallenges[userId];

    if (!expectedChallenge) {
        return res.status(400).json({ message: "Challenge not found or expired" });
    }

    try {
        // We need the specific passkey the user authenticated with
        const passkey = await User.getPasskeyByCredentialId(body.id);
        
        if (!passkey) {
            return res.status(400).json({ message: "Authenticator is not registered with this site" });
        }

        const verification = await verifyAuthenticationResponse({
            response: body,
            expectedChallenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
            credential: {
                id: passkey.credential_id,
                publicKey: new Uint8Array(Buffer.from(passkey.public_key, 'base64url')),
                counter: passkey.counter,
            },
        });

        const { verified, authenticationInfo } = verification;

        if (verified) {
            // Update counter
            await User.updatePasskeyCounter(passkey.credential_id, authenticationInfo.newCounter);
            
            // Mark attendance
            const Attendance = require('../models/Attendance');
            await Attendance.createAttendance(userId, activityId, 'present', true);

            delete userChallenges[userId];
            res.json({ verified: true });
        } else {
            res.status(400).json({ verified: false, message: "Verification failed" });
        }
    } catch (error) {
        console.error("Verify Authentication Error:", error);
        res.status(400).json({ verified: false, message: error.message });
    }
};

module.exports = {
    generateRegistration,
    verifyRegistration,
    generateAuthentication,
    verifyAuthentication
};
