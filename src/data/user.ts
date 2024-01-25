import bcrypt from 'bcryptjs';

const users = [
  {
    name: "Luin",
    email: "admin@gmail.com",
    password: bcrypt.hashSync('asd', 10),
    isAdmin: true
  },
]

export default users