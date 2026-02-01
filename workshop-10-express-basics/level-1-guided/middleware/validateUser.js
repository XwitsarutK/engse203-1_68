const validateUser = (req, res, next) => {
  const { name, email, age } = req.body;

  // Validate required fields
  if (!name || !email) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Name and email are required fields'
    });
  }

  // Validate name (should not be empty string)
  if (typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Name must be a non-empty string'
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Invalid email format'
    });
  }

  // Validate age if provided
  if (age !== undefined) {
    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Age must be a valid number between 0 and 150'
      });
    }
  }

  // If all validations pass, proceed to next middleware
  next();
};

module.exports = validateUser;
