import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import CardBox from '../components/CardBox';
import ResponsiveAppBar from '../components/ResponsiveAppBar';

export default function About({ data }) {
  const fakeUser = data[0];
  const fakeUser2 = data[1];
  return (
    <div>
      <ResponsiveAppBar />
      <h1>This is about Peter Park!</h1>
      <Link href='/'>
        <a>This is the main page</a>
      </Link>
      <br />
      <CardBox
        profileName={fakeUser.name}
        profileDescription={fakeUser.description}
        image={fakeUser.profile_image_url}
      />
      <br />
      <CardBox
        profileName={fakeUser2.name}
        profileDescription={fakeUser2.description}
        image={fakeUser2.profile_image_url}
      />
    </div>
  );
}

export async function getServerSideProps() {
  const response = await fetch('http://localhost:4000/api/v1/user');
  const data = await response.json();

  return {
    props: { data },
  };
}
