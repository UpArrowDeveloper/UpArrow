import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import api from '../apis';
import { useAppUser } from '../hooks/useAppUser';
import { getUploadUrl } from '../utils/file';
import { MainLayout } from '../Layouts';
import { Body16Regular, HeadH5Bold } from '../styles/typography';
import color from '../styles/color';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Button from '../components/common/Button';
import { ProfileImageUploader } from '../components/common/ProfileImageUploader';
import useModal from '../hooks/useModal';
import { SignupCelebrate } from '../components/Popup/SignupCelebrate';

export function SignupPage() {
  const router = useRouter();
  const { user } = useAppUser({ isAuthorized: true });
  const formRef = useRef();
  const [profileImage, setProfileImage] = useState();
  const { openModal, closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const username = e.target.username.value;
    const investmentPhilosophy = e.target.investmentPhilosophy.value;
    const websiteUrl = e.target.websiteUrl.value;
    const isAdmin = false;
    if (!username || username === '') {
      return alert('need username');
    }
    if (!profileImage) {
      return alert('need profile image');
    }

    const profileImageUrl = await getUploadUrl(profileImage);
    const userDocument = await api.user.updateById(user._id, {
      name,
      profileImageUrl,
      username,
      email: user.email,
      investmentPhilosophy,
      websiteUrl,
      isAdmin,
    });

    if (userDocument) {
      openModal({
        children: SignupCelebrate,
        onConfirm: () => {
          router.push('/');
          closeModal();
        },
      });
    } else {
      // if posting a user fails, reload the page and then show snack bar that tells them why
      // if I get 400 make a message that you already registered with this email and show the email they registered
      // registration failed
      console.error('sign up fail');
      router.reload();
    }
  };

  return (
    <SignupBlock>
      <div className='title-block'>
        <h1>Welcome!</h1>
        <h3>Please enter your basic information.</h3>
      </div>
      <form ref={formRef} className='signup-form' onSubmit={handleSubmit}>
        <div className='file-uploader-wrapper'>
          <ProfileImageUploader
            name='profileImageUrl'
            file={profileImage}
            setImage={setProfileImage}
          />
        </div>

        <div className='text-field'>
          <Input label='Username' type='text' id='username' name='username' />
        </div>

        <div className='text-field'>
          <Input
            label='Social Media'
            type='text'
            id='websiteUrl'
            name='websiteUrl'
            placeholder='ex. Youtube, Instagram, Twitter, Linkedin'
          />
        </div>

        <div className='text-field'>
          <Textarea
            label='Investment Philosophy'
            rows='5'
            type='investmentPhilosophy'
            id='investmentPhilosophy'
            name='investmentPhilosophy'
            placeholder='ex. I like to invest long-term in growth stocks.'
          />
        </div>

        <Button className='button' type='submit'>
          Summit
        </Button>
      </form>
    </SignupBlock>
  );
}

export default function MainPage(props) {
  return (
    <MainLayout>
      <SignupPage {...props} />
    </MainLayout>
  );
}

const SignupBlock = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title-block {
    & > h1 {
      font-style: normal;
      font-weight: 600;
      font-size: 4.8rem;
      line-height: 5.8rem;
      text-align: center;
      margin-bottom: 1rem;
    }

    & > h3 {
      ${Body16Regular}
      margin-bottom: 4rem;
    }
  }

  .signup-form {
    width: 65rem;
    display: flex;
    flex-direction: column;
    border: 0.1rem solid ${color.B80};
    border-radius: 1.6rem;
    padding: 2.4rem 3.2rem;
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

  button {
    height: 5.6rem;
    font-family: 'Inter';
    ${HeadH5Bold}
    color: ${color.B96}
  }

  .file-uploader-wrapper {
    display: flex;
    justify-content: center;

    img.empty-image {
      background-image: url('/images/profile-upload.jpg');
      background-size: cover;
      background-repeat: no-repeat;
      border-image-width: 0;
    }
  }
`;
