import SubmissionStatus from './SubmissionStatus';
import User from './User';

type Submission = {
    id: number;
    title: string;
    symptoms: string;
    status: SubmissionStatus;
    doctor: User;
    patient: User;
    created_at: string;
}

export default Submission;