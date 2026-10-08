import { Equipment, Room } from '../types';

export const ALL_EQUIPMENT: Equipment[] = [
  'Projector',
  'Whiteboard',
  'High-end PCs',
  'Air Conditioning',
];

export const BUILDINGS = ['A', 'B', 'C', 'V'] as const;

export const ROOMS: Room[] = [
  {
    id: 'a101',
    name: 'A101 – Study Hub',
    building: 'A',
    floor: 1,
    capacity: 8,
    equipment: ['Whiteboard', 'Air Conditioning'],
    imageUrl:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    description: 'Quiet group study room near the library entrance.',
  },
  {
    id: 'a205',
    name: 'A205 – Seminar',
    building: 'A',
    floor: 2,
    capacity: 16,
    equipment: ['Projector', 'Whiteboard', 'Air Conditioning'],
    imageUrl:
      'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&q=80',
    description: 'Ideal for presentations and project reviews.',
  },
  {
    id: 'b112',
    name: 'B112 – Lab Lite',
    building: 'B',
    floor: 1,
    capacity: 12,
    equipment: ['High-end PCs', 'Projector', 'Air Conditioning'],
    imageUrl:
      'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&q=80',
    description: 'Computer lab for coding practice and workshops.',
  },
  {
    id: 'b304',
    name: 'B304 – Focus Pod',
    building: 'B',
    floor: 3,
    capacity: 4,
    equipment: ['Whiteboard', 'Air Conditioning'],
    imageUrl:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
    description: 'Compact room for 2–4 students working deeply.',
  },
  {
    id: 'c201',
    name: 'C201 – Collab Space',
    building: 'C',
    floor: 2,
    capacity: 20,
    equipment: ['Projector', 'Whiteboard', 'Air Conditioning'],
    imageUrl:
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
    description: 'Large collaboration hall for club meetings.',
  },
  {
    id: 'c118',
    name: 'C118 – Dev Lab',
    building: 'C',
    floor: 1,
    capacity: 18,
    equipment: ['High-end PCs', 'Projector', 'Air Conditioning'],
    imageUrl:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    description: 'High-spec PCs for graphics and software labs.',
  },
  {
    id: 'v101',
    name: 'V101 – Innovation',
    building: 'V',
    floor: 1,
    capacity: 10,
    equipment: ['Projector', 'Whiteboard', 'High-end PCs', 'Air Conditioning'],
    imageUrl:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80',
    description: 'Fully equipped room in Building V for hackathons.',
  },
  {
    id: 'v210',
    name: 'V210 – Quiet Zone',
    building: 'V',
    floor: 2,
    capacity: 6,
    equipment: ['Whiteboard', 'Air Conditioning'],
    imageUrl:
      'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80',
    description: 'Calm space for thesis writing and tutoring.',
  },
  {
    id: 'a312',
    name: 'A312 – Media Room',
    building: 'A',
    floor: 3,
    capacity: 14,
    equipment: ['Projector', 'High-end PCs', 'Air Conditioning'],
    imageUrl:
      'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80',
    description: 'Media-ready room with strong AV support.',
  },
  {
    id: 'b220',
    name: 'B220 – Team Room',
    building: 'B',
    floor: 2,
    capacity: 8,
    equipment: ['Whiteboard', 'Projector'],
    imageUrl:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
    description: 'Mid-size team room with writable walls.',
  },
  {
    id: 'c305',
    name: 'C305 – Capstone',
    building: 'C',
    floor: 3,
    capacity: 12,
    equipment: ['Projector', 'Whiteboard', 'Air Conditioning'],
    imageUrl:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
    description: 'Reserved frequently for graduation projects.',
  },
  {
    id: 'v305',
    name: 'V305 – Maker Corner',
    building: 'V',
    floor: 3,
    capacity: 16,
    equipment: ['High-end PCs', 'Whiteboard', 'Air Conditioning'],
    imageUrl:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    description: 'Hands-on workspace for maker and IoT groups.',
  },
];
