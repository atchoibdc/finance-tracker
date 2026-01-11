import { getCategories } from '@/lib/data';
import CategoryManager from '@/components/CategoryManager';

export const revalidate = 0;

export default async function CategoriesPage() {
    // @ts-ignore
    const categories = await getCategories();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                    Categories
                </h1>
                <p className="text-slate-500 mt-1">Organize your financial tracking.</p>
            </div>
            <CategoryManager initialCategories={categories} />
        </div>
    );
}
