const User = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
    const { name, email, password, institution, branch, batchYear } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            institution,
            branch,
            batchYear
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            institution: user.institution,
            branch: user.branch,
            batchYear: user.batchYear,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && user.password && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                institution: user.institution,
                branch: user.branch,
                batchYear: user.batchYear,
                bio: user.bio,
                location: user.location,
                company: user.company,
                designation: user.designation,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth via OAuth
// @route   POST /api/auth/oauth
exports.oauthLogin = async (req, res) => {
    const { email, name, provider, providerId } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            if (!user.providerId) {
                user.authProvider = provider;
                user.providerId = providerId;
                await user.save();
            }
        } else {
            user = await User.create({
                name,
                email,
                authProvider: provider,
                providerId,
                branch: 'Not Set',
                batchYear: 'Not Set'
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            branch: user.branch,
            batchYear: user.batchYear,
            bio: user.bio,
            location: user.location,
            company: user.company,
            designation: user.designation,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.institution = req.body.institution || user.institution;
            user.branch = req.body.branch || user.branch;
            user.batchYear = req.body.batchYear || user.batchYear;
            user.bio = req.body.bio || user.bio;
            user.location = req.body.location || user.location;
            user.company = req.body.company || user.company;
            user.designation = req.body.designation || user.designation;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                institution: updatedUser.institution,
                branch: updatedUser.branch,
                batchYear: updatedUser.batchYear,
                bio: updatedUser.bio,
                location: updatedUser.location,
                company: updatedUser.company,
                designation: updatedUser.designation,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users (Directory)
// @route   GET /api/auth/users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth via LinkedIn OpenID Connect
// @route   GET /api/auth/linkedin/callback
exports.linkedinAuthCallback = async (req, res) => {
    const { code, state } = req.query;

    if (!code) {
        return res.status(400).send('Authorization code missing from LinkedIn redirect');
    }

    try {
        // Parse state to get the redirect url if provided by frontend
        let redirectUrl = 'http://localhost:19006'; // default
        if (state) {
            try {
                const stateObj = JSON.parse(decodeURIComponent(state));
                if (stateObj.redirectUrl) {
                    redirectUrl = stateObj.redirectUrl;
                }
            } catch (err) {
                console.error('Failed to parse state param', err);
            }
        }

        // 1. Exchange code for access token
        const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
            params: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        const accessToken = tokenResponse.data.access_token;

        // 2. Fetch user profile from LinkedIn
        const userResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });

        const { sub, name, given_name, family_name, picture, email } = userResponse.data;

        if (!email) {
            return res.status(400).send('Email missing from LinkedIn profile');
        }

        // 3. Find or Create User
        let user = await User.findOne({ email });

        if (user) {
            // Update auth provider if they logged in with local previously
            if (!user.providerId) {
                user.authProvider = 'linkedin';
                user.providerId = sub;
                if (picture && !user.profilePicture) user.profilePicture = picture;
                await user.save();
            }
        } else {
            // Create new verified user
            user = await User.create({
                name: name || `${given_name} ${family_name}`,
                email,
                authProvider: 'linkedin',
                providerId: sub,
                profilePicture: picture,
                branch: 'Not Set',
                batchYear: 'Not Set',
                verified: true
            });
        }

        // 4. Generate JWT
        const token = generateToken(user._id);

        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            institution: user.institution,
            branch: user.branch,
            batchYear: user.batchYear,
            bio: user.bio,
            location: user.location,
            company: user.company,
            designation: user.designation,
            profilePicture: user.profilePicture,
            token
        };

        // 5. Redirect back to mobile deep link with token
        const finalRedirectUrl = `${redirectUrl}?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
        res.redirect(finalRedirectUrl);

    } catch (error) {
        console.error('LinkedIn OAuth Error:', error.response?.data || error.message);
        res.status(500).send('LinkedIn OAuth Error: ' + (error.response?.data?.message || error.message));
    }
};
