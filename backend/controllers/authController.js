import User from '../models/User.js';
import { generateToken } from '../middleware/authMiddleware.js';

export async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please provide username, email, and password.' });
    }

    const trimmedUsername = String(username).trim();
    const trimmedEmail = String(email).trim().toLowerCase();

    if (trimmedUsername.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const userExists = await User.findOne({
      $or: [{ email: trimmedEmail }, { username: trimmedUsername }],
    });

    if (userExists) {
      if (userExists.email === trimmedEmail) {
        return res.status(400).json({ error: 'An account with this email already exists.' });
      }
      return res.status(400).json({ error: 'This username is already taken.' });
    }

    const user = await User.create({
      username: trimmedUsername,
      email: trimmedEmail,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ error: 'Invalid user data.' });
    }
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: err.message || 'Server error during registration.' });
  }
}

export async function loginUser(req, res) {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ error: 'Please provide email/username and password.' });
    }

    const inputStr = String(login).trim();

    const user = await User.findOne({
      $or: [{ email: inputStr.toLowerCase() }, { username: inputStr }],
    });

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ error: 'Invalid email/username or password.' });
    }
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: err.message || 'Server error during login.' });
  }
}

export async function getMe(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }
    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
