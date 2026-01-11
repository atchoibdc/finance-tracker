import { getCategories } from '@/lib/data';
import TransactionForm from '@/components/TransactionForm';

export const revalidate = 0;

export default async function NewTransactionPage() {
    // @ts-ignore
    const categories = await getCategories();

    return (
        <div>
            <TransactionForm categories={categories} />
        </div>
    );
}
