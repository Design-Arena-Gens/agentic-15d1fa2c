export type MenuOptionValue = {
  id: string;
  name: string;
  priceDelta: number;
  isDefault: boolean;
};

export type MenuOption = {
  id: string;
  label: string;
  type: string;
  isRequired: boolean;
  maxSelectable?: number | null;
  values: MenuOptionValue[];
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  tags: string[];
  preparationTime: number;
  spicyLevel?: number | null;
  calories?: number | null;
  options: MenuOption[];
};

export type MenuCategory = {
  id: string;
  name: string;
  description?: string | null;
  heroImage?: string | null;
  items: MenuItem[];
};

export type Offer = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  discountType: string;
  value: number;
  minimumSpend: number | null;
  startsAt: string;
  endsAt: string;
  isStackable: boolean;
  menuItems: { id: string; name: string; price: number; imageUrl?: string | null }[];
};

export type HomePayload = {
  menu: MenuCategory[];
  offers: Offer[];
  mostOrdered: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string | null;
    sold: number;
  }[];
  recommended: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string | null;
    context: string;
    weight: number;
  }[];
};

export type Address = {
  id: string;
  label: string;
  street: string;
  city: string;
  region: string;
  instructions?: string | null;
  isDefault: boolean;
};

export type Order = {
  id: string;
  status: string;
  createdAt: string;
  total: number;
  etaMinutes?: number | null;
  address: Address;
  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    menuItem: { id: string; name: string; imageUrl?: string | null };
  }[];
};
