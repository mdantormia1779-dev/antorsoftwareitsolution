import { loginUser, logoutUser, requestPasswordReset, resetPasswordWithOtp, registerAdmin, updateAdminProfile} from './auth.service.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const device = req.headers['user-agent'] || 'Unknown Device';

    // সার্ভিস ফাংশনে অবজেক্ট আকারে ডেটা পাস করা হচ্ছে
    const result = await loginUser({ email, password, ipAddress, device });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.token; // verifyAuth মিডলওয়্যার থেকে পাওয়া টোকেন
    const result = await logoutUser(token);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await requestPasswordReset(email);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: result.message,
      ...(result.debugOtp && { debugOtp: result.debugOtp })
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const result = await resetPasswordWithOtp({ email, otp, newPassword });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};


export const signup = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    const result = await registerAdmin({ fullName, email, password });
    
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { id, fullName, companyName, password } = req.body;
    
    const result = await updateAdminProfile({ id, fullName, companyName, password });

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};