import {
  Clock,
  Truck,
  Droplets,
  Flame,
  Sparkles,
  PackageCheck,
} from 'lucide-react';

const INITIAL_STAGES = [
  {
    id: 'placed',
    label: 'Order Placed',
    shortLabel: 'Placed',
    color: 'bg-slate-100 text-slate-700 border-slate-300',
    badgeBg: 'bg-slate-600',
    icon: Clock,
    whatsappTemplate: 'Hi {name}, your laundry order #{id} has been received at WashFlow! Pickup/processing has started.'
  },
  {
    id: 'picked_up',
    label: 'Picked Up',
    shortLabel: 'Picked Up',
    color: 'bg-sky-50 text-sky-700 border-sky-200',
    badgeBg: 'bg-sky-500',
    icon: Truck,
    whatsappTemplate: 'Hi {name}, your clothes for order #{id} ({itemsCount} items) have been picked up and tagged at our hub.'
  },
  {
    id: 'washing',
    label: 'Washing & Processing',
    shortLabel: 'Washing',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    badgeBg: 'bg-blue-600',
    icon: Droplets,
    whatsappTemplate: 'Hi {name}, update on order #{id}: Your clothes are currently in premium eco-wash & stain treatment!'
  },
  {
    id: 'ironing',
    label: 'Steam Iron & QC',
    shortLabel: 'Iron & QC',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badgeBg: 'bg-indigo-600',
    icon: Flame,
    whatsappTemplate: 'Hi {name}, your order #{id} is washed and now undergoing crisp Steam Ironing & Quality Check.'
  },
  {
    id: 'ready',
    label: 'Ready / Out for Delivery',
    shortLabel: 'Ready / Out',
    color: 'bg-amber-50 text-amber-800 border-amber-200',
    badgeBg: 'bg-amber-500',
    icon: Sparkles,
    whatsappTemplate: 'Good news {name}! Order #{id} is packed and out for delivery. Total payable: ₹{amount}.'
  },
  {
    id: 'delivered',
    label: 'Delivered',
    shortLabel: 'Delivered',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeBg: 'bg-emerald-600',
    icon: PackageCheck,
    whatsappTemplate: 'Thank you {name}! Order #{id} has been delivered. Hope you loved our fresh laundry service!'
  }
];

export default INITIAL_STAGES;
