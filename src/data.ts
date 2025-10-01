import type { Message, QuestionItem } from './types';

export const initialMessages: Message[] = [
  {
    id: 'm8',
    author: 'ai',
    text:
      'Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, ' +
      'sem quam semper libero, sit amet adipiscing sem neque sed ipsum.',
    createdAt: '2025-01-01T10:00:00Z'
  },
  {
    id: 'm9',
    author: 'user',
    text:
      'Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. ' +
      'Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem.',
    createdAt: '2025-01-01T10:01:00Z'
  },
  {
    id: 'm10',
    author: 'ai',
    text:
      'Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, ' +
      'nam quam nunc, blandit vel, luctus pulvinar, sodales, augue velit cursus nunc velit.',
    createdAt: '2025-01-01T10:02:00Z'
  },
  {
    id: 'm11',
    author: 'user',
    text:
      'Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. ' +
      'Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas.',
    createdAt: '2025-01-01T10:04:00Z'
  },
  {
    id: 'm12',
    author: 'ai',
    text:
      'Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. ' +
      'Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna.',
    createdAt: '2025-01-01T10:05:00Z',
    subMessages: [
      'Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna.',
      'Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus.',
      'Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus.'
    ],
    subMessageReplies: {
      0: [
        {
          id: 'm12_0_1',
          author: 'user',
          text: 'Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio tincidunt tempus?',
          createdAt: '2025-01-01T10:06:00Z'
        },
        {
          id: 'm12_0_2',
          author: 'ai',
          text: 'Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem.',
          createdAt: '2025-01-01T10:07:00Z'
        },
        {
          id: 'm12_0_3',
          author: 'user',
          text: 'Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio tincidunt tempus?',
          createdAt: '2025-01-01T10:08:00Z'
        },
        {
          id: 'm12_0_4',
          author: 'ai',
          text: 'Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem.',
          createdAt: '2025-01-01T10:09:00Z'
        }
      ]
    }
  },
  {
    id: 'm13',
    author: 'user',
    text:
      'Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. ' +
      'Maecenas nec odio et ante tincidunt tempus.',
    createdAt: '2025-01-01T10:06:00Z'
  },
  {
    id: 'm14',
    author: 'ai',
    text:
      'Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed.',
    createdAt: '2025-01-01T10:07:00Z'
  }
];

export const initialQuestions: QuestionItem[] = [
  { id: 'q1', title: 'Donec pede justo', folder: 'General', messageId: 'm8' },
  { id: 'q2', title: 'Nulla consequat massa quis', folder: 'General', messageId: 'm9' },
  { id: 'q3', title: 'Aenean commodo', folder: 'General', messageId: 'm10' },
  { id: 'q4', title: 'Ut wisi enim ad minim', folder: 'Follow-ups', messageId: 'm12' },
  { id: 'q5', title: 'Sed fringilla mauris', folder: 'Follow-ups', messageId: 'm12' },
  { id: 'q6', title: 'Curabitur ullamcorper', folder: 'Notes', messageId: 'm11' }
];
