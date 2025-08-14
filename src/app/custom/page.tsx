import { Metadata } from 'next';
import BraceletDesigner from '@/components/BraceletDesigner';

export const metadata: Metadata = {
  title: 'Custom Bracelet Designer | ROIHIN',
  description: 'Design your own personalized stone bracelet with our interactive designer',
};

export default function CustomPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <BraceletDesigner />
    </main>
  );
}