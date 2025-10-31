const userAction = (req, res) => {
  try {
    res.status(200).json({ message: "User action accessed successfully" });
  } catch (error) {
    return res.json({
      message: error.message,
      stack: error.stack,
    });
  }
};

export { userAction };
