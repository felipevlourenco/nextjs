import NextAuth, { AuthOptions, CallbacksOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
  ],
  callbacks: {
    async signIn({ profile }: { profile: { login: string } }) {
      return profile.login === 'felipevlourenco';
    },
  } as unknown as CallbacksOptions,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
