import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import api from '../apis';
import { useAppUser } from '../hooks/useAppUser';

const SignupBlock = styled.div`
  padding-top: 11rem;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 10rem;

  .signup-form {
    display: flex;
    flex-direction: column;
  }

  .text-field {
    margin-bottom: 3rem;
    display: flex;
    flex-direction: column;
    font-size: 2rem;

    & > label {
      margin-bottom: 1rem;
    }
  }

  .button {
    background-color: transparent;
    border: solid 0.3rem transparent;
    box-shadow: 0rem 0rem 1rem #c4c7cc;
    border-radius: 0.6rem;
    width: 12rem;
    color: rgb(32, 38, 46);
    font-size: 1.6rem;
    margin-bottom: 2rem;
    font-weight: 900;
    :hover {
      border: 0.3rem solid gray;
    }
  }
`;

export default function Signup() {
  const router = useRouter();
  const { user } = useAppUser();
  const formRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const profileImageUrl = e.target.profileImageUrl.value;
    const username = e.target.username.value;
    const investmentPhilosophy = e.target.investmentPhilosophy.value;
    const websiteUrl = e.target.websiteUrl.value;
    const cash = e.target.cash.value;
    const isAdmin = false;
    if (!username || username === '') {
      return alert('need username');
    }

    const userDocument = await api.user.updateById(user._id, {
      name,
      profileImageUrl,
      username,
      email: user.email,
      investmentPhilosophy,
      websiteUrl,
      isAdmin,
      cash,
    });

    if (userDocument) {
      router.push('/');
    } else {
      // if posting a user fails, reload the page and then show snack bar that tells them why
      // if I get 400 make a message that you already registered with this email and show the email they registered
      // registration failed
      console.error('sign up fail');
      router.reload();
    }
  };

  useEffect(() => {
    if (user) {
      formRef.current.name.value = user.name;
      formRef.current.profileImageUrl.value = user.profileImageUrl;
      formRef.current.cash.value = user.cash;
    }
  }, [user]);

  if (!user) return 'please login';

  return (
    <SignupBlock>
      <form ref={formRef} className='signup-form' onSubmit={handleSubmit}>
        <div className='text-field'>
          <label htmlFor='firstname'>name</label>
          <input type='text' id='name' name='name'></input>
        </div>

        <div className='text-field'>
          <label htmlFor='username'>Username</label>
          <input
            type='text'
            id='username'
            name='username'
            placeholder='This is the name visible to other UpArrow users'
          ></input>
        </div>

        <div className='text-field'>
          <label htmlFor='profileImageUrl'>Profile Image URL</label>
          <input
            type='text'
            id='profileImageUrl'
            name='profileImageUrl'
            placeholder='This is the profile image visible to other UpArrow users'
          ></input>
        </div>

        <div className='text-field'>
          <label htmlFor='websiteUrl'>Social Media</label>
          <input
            type='text'
            id='websiteUrl'
            name='websiteUrl'
            placeholder='YouTube, Instagram, Twitter, LinkedIn, or your personal website for other UpArrow users to follow you'
          ></input>
        </div>

        <div className='text-field'>
          <label htmlFor='investmentPhilosophy'>Investment Philosophy</label>
          <textarea
            rows='3'
            type='investmentPhilosophy'
            id='investmentPhilosophy'
            name='investmentPhilosophy'
            placeholder='Tell us about your investment philosophy. What made you start investing? What type of stocks are you interested?'
          />
        </div>

        <div className='text-field'>
          <label htmlFor='cash'>Simulation Money</label>
          <input
            type='text'
            id='cash'
            name='cash'
            placeholder=''
            disabled
          ></input>
          {/* <select id='cash' name='cash' disabled>
            <option selected value={100000}>
              $100,000
            </option>
          </select> */}
        </div>

        <div className='text-field'>
          * Simulation Money is the money you can use in UpArrow to simulate
          stock investment.
        </div>

        <input className='button' type='submit' value='Submit'></input>
      </form>
    </SignupBlock>
  );
}
