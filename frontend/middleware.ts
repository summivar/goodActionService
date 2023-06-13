import {NextResponse} from 'next/server';

const containsString = (str: string, strings: string[]) => {
  return strings.some((s) => str.includes(s));
};

const urlSignUp = 'http://localhost:3000/signUp'
const protectedUrl = ['myAccount', 'list']

export default function middleware(req: any){
  const refreshToken = req.cookies.get('refToken');
  const url = req.url;

  if(!refreshToken && containsString(url, protectedUrl)){
    return NextResponse.redirect(urlSignUp);
  }
}
