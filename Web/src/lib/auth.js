import CredentialsProvider from 'next-auth/providers/credentials'
import connectDB from './mongodb'
import User from '../models/User'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' }
      },
      async authorize(credentials) {
        try {
          await connectDB()

          const user = await User.findOne({ email: credentials.email })
          if (!user) {
            throw new Error('Email ou mot de passe incorrect')
          }

          const isValid = await user.comparePassword(credentials.password)
          if (!isValid) {
            throw new Error('Email ou mot de passe incorrect')
          }

          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
          }
        } catch (error) {
          throw new Error(error.message)
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role
        session.user.id = token.userId
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 heures
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export async function getAuthSession() {
  return await getServerSession(authOptions)
} 