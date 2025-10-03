import { Comment } from '@/features/RescueDetail/components/RescueInteraction';
import {
  RescueParticipantType,
  RescueUpdate,
} from '@/features/RescueDetail/types';

export type AnimalRescueStatus =
  | 'pending'
  | 'inProgress'
  | 'treated'
  | 'recovering'
  | 'awaitingAdoption'
  | 'adopted'
  | 'failed';

export interface AnimalDetail {
  id: string;
  name: string;
  animalType: string;
  age: 'baby' | 'young' | 'adult' | 'senior';
  appearance: {
    color: string;
    hasInjury: boolean;
    injuryDescription?: string;
    otherFeatures?: string;
  };
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  foundTime: string;
  status: AnimalRescueStatus;
  statusDescription: string;
  reporterPhotos: string[];
  videos?: string[];
  reporter: {
    id: string;
    name: string;
    contactInfo: {
      phone: string;
      email?: string;
    };
  };
  updates: RescueUpdate[];
  interactions: {
    comments: Comment[];
    rescueParticipants: RescueParticipantType[];
  };

  stats: {
    viewCount: number;
    likeCount: number;
    shareCount: number;
  };
  createdAt: string;
  updatedAt: string;
}
