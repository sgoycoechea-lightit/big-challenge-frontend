import UserRole from './UserRole';

type User = {
    id: number;
    name: string;
    email: string;
    token: string;
    role: UserRole;
    phone_number: string | null;
    weight: number | null;
    height: number | null;
    other_information: string | null;
}

export default User;