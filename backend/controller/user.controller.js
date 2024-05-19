// export const userSignup = async (req, res) => {
//     const { name, email,  } = req.body;
  
//     if (
//       !name ||
//       !email) {
//       console.log("All fields are required");
//     }
  
//     const hashedPassword = bcryptjs.hashSync(password, 10);
  
//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//     });
  
//     try {
//       await newUser.save();
//       res.json({ message: "Signup  succesful" });
//     } catch (error) {
//       next(error);
//     }
//   }; 