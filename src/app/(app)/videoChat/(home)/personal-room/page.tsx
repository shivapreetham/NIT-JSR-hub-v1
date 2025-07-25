'use client';
// usestream video client is somehting that i have to study and analyse for me to be able to put my own logic onto it
// the very fact that i am typing this sitting in the airport 
// my lovely airport in bengaluru is actually bringing me down to tears 
// but i believe moving on with commenting and understanding the system is really important 

import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';

import { useGetCallById } from '@/app/hooks/useGetCallById';
import { Button } from '@/components/ui/button';
import { useToast } from '@/app/hooks/use-toast';
import { useCurrentUserContext } from '@/context/CurrentUserProvider';

const Table = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="flex flex-col items-start gap-2 xl:flex-row">
      <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">{title}:</h1>
      <h1 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">{description}</h1>
    </div>
  );
};

const PersonalRoom = () => {
  const router = useRouter();
  const client = useStreamVideoClient();
  const { toast } = useToast();
  const { currentUser } = useCurrentUserContext();

  const meetingId = currentUser?.id;
  const { call } = useGetCallById(meetingId!);

  const startRoom = async () => {
    if (!client || !currentUser) return;

    const newCall = client.call('default', meetingId!);

    if (!call) {
      await newCall.getOrCreate({ data: { starts_at: new Date().toISOString() } });
    }

    router.push(`videoChat/meeting/${meetingId}?personal=true`);
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`;

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-xl font-bold lg:text-3xl">Personal Meeting Room</h1>
      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
        <Table title="Topic" description={`${currentUser?.username}'s Meeting Room`} />
        <Table title="Meeting ID" description={meetingId!} />
        <Table title="Invite Link" description={meetingLink} />
      </div>
      <div className="flex gap-5">
        <Button className="bg-blue-1" onClick={startRoom}>
          Start Meeting
        </Button>
        <Button
          className="bg-dark-3"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: 'Link Copied' });
          }}>
          Copy Invitation
        </Button>
      </div>
    </section>
  );
};

export default PersonalRoom;
