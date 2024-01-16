import bcrypt from 'bcryptjs';

const users = [
  {
    name: "Luin",
    email: "admin@gmail.com",
    password: bcrypt.hashSync('asd', 10),
    isAdmin: true
  },
  {
    name: "Nam",
    email: "nam@gmail.com",
    password: bcrypt.hashSync('asd', 10),
    isAdmin: false
  }
]

export default users