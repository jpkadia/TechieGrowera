// Public business details supplied by the founders. No secrets belong in this file.
export type Founder = {
  name: string;
  role: string;
  image?: string;
  portfolio?: string;
  linkedin?: string;
};

export const business = {
  tagline: 'Scaling Digital Presence with Intent',
  founders: [
    {
      name: 'Parth Kadiya',
      role: 'Web Developer',
      image: '/team/parth.webp',
      portfolio: 'https://parthkadiya.vercel.app',
      linkedin: 'https://www.linkedin.com/in/parth-kadiya/',
    },
    {
      name: 'Kush Kadia',
      role: 'Digital Marketing Executive',
      image: '/team/kush.webp',
      portfolio: '',
      linkedin: 'https://www.linkedin.com/in/kush-kadia',
    },
  ] as Founder[],
  email: 'techiegrowera@gmail.com',
  phones: ['+919081818478', '+919265839282'],
  instagram: 'https://www.instagram.com/techiegrowera/',
  linkedin: 'https://www.linkedin.com/company/techiegrowera',
  youtube: 'https://www.youtube.com/@techiegrowera',
  twitter: 'https://x.com/techiegrowera',
  facebook: 'https://www.facebook.com/share/1J1JeovMau',
};
