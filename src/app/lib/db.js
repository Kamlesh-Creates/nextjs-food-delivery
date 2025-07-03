import dotenv from 'dotenv';
dotenv.config();

// const username = process.env.Username;
const password = process.env.PASSWORD;

export const connectionStr = `mongodb+srv://kamleshsatpute51:${password}@cluster0.noj78nd.mongodb.net/quickserve?retryWrites=true&w=majority&appName=Cluster`;



