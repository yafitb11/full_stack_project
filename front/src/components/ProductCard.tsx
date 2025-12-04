import { Button, Card } from "flowbite-react";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { TProduct, TCategory } from "../types/types";

interface ProductCardProps {
    product: TProduct;
    variant: 'large' | 'compact';
    isLiked: boolean;
    onLike: () => void;
    onDelete?: () => void;
    onAddToCart: () => void;
    onEdit: () => void;
    onNavigate: () => void;
    isAdmin: boolean;
}

const ProductCard = ({ product, variant, isLiked, onLike, onDelete, onAddToCart, onEdit, onNavigate, isAdmin }: ProductCardProps) => {
    if (variant === 'compact') {
        return (
            <Card className="w-[180px] h-[230px] flex !p-4 !m-0 [&&>*]:!p-0 [&&]:!m-0 colorMix">
                <div onClick={onNavigate} className="cursor-pointer flex flex-col flex-1 !p-0 !m-0">
                    <div className="h-[80px] w-full mb-[6px]">
                        <img
                            src={product.image.url}
                            alt={product.image.alt}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                    <div className="text-center overflow-y-auto overflow-x-hidden h-[70px]">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 mb-1">
                            {product.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                            {product.subtitle}
                        </p>
                    </div>

                    <div className="flex justify-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        {isAdmin ? (
                            <>
                                <MdEdit
                                    className="text-black dark:text-white cursor-pointer text-lg hover:text-green-500 dark:hover:text-green-500"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit();
                                    }}
                                    title="Edit product"
                                />
                                <FaTrash
                                    className="text-black dark:text-white cursor-pointer text-base hover:text-red-600 dark:hover:text-red-600"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete?.();
                                    }}
                                    title="Delete product"
                                />
                            </>
                        ) : (
                            <>
                                <FaHeart
                                    className={`${isLiked ? "text-red-500" : "text-gray-500"} cursor-pointer text-lg hover:scale-110 transition-transform`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onLike();
                                    }}
                                    title={isLiked ? "Unlike" : "Like"}
                                />
                                <FaShoppingCart
                                    className="text-blue-500 cursor-pointer text-lg hover:scale-110 transition-transform"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAddToCart();
                                    }}
                                    title="Add to cart"
                                />
                            </>
                        )}
                    </div>
                </div>
            </Card>
        );
    }

    // Large variant
    return (
        <Card className="mycard">
            <div className="imageDiv">
                <img src={product.image.url} alt={product.image.alt} />
            </div>

            <div className="textDiv">
                <p className="text-gray-800 dark:text-gray-400 mb-2">
                    {(product.category_id as TCategory)?.title}
                </p>
                <h3 className="!text-2xl font-bold text-gray-900 dark:text-white">
                    {product.title}
                </h3>
                <h3 className="!text-lg font-semibold text-gray-900 dark:text-white">
                    {product.subtitle}
                </h3>

                <div className="!mt-[6px]">
                    <span
                        className={`font-bold ${product.isDiscount
                            ? "text-xl text-blue-400 dark:text-blue-700"
                            : "text-2xl text-blue-600 dark:text-blue-400"
                            }`}
                    >
                        ${product.price}
                    </span>
                    <span className="text-sm text-gray-400">
                        {product.likes.length} likes
                    </span>
                </div>

                {product.isDiscount && (
                    <p className="text-2xl font-bold text-blue-600 mt-1 dark:text-blue-400">
                        In discount ${product.discountedPrice} !
                    </p>
                )}

                <p className="text-gray-600 dark:text-gray-300 mt-[6px]">
                    {product.description}
                </p>
            </div>

            <div className="cardButtonsDiv">
                <Button color="blue" onClick={onNavigate}>
                    View Details
                </Button>
                <div className="flex space-x-2">
                    {isAdmin ? (
                        <>
                            <MdEdit
                                className="text-black dark:text-white cursor-pointer text-2xl hover:text-green-500 dark:hover:text-green-500"
                                onClick={onEdit}
                                title="Edit product"
                            />
                            <FaTrash
                                className="text-black dark:text-white cursor-pointer text-xl hover:text-red-600 dark:hover:text-red-600"
                                onClick={onDelete}
                                title="Delete product"
                            />
                        </>
                    ) : (
                        <>
                            <FaHeart
                                className={`${isLiked ? "text-red-500" : "text-gray-500"
                                    } cursor-pointer text-xl`}
                                onClick={onLike}
                            />
                            <FaShoppingCart
                                className="text-blue-500 cursor-pointer text-xl"
                                onClick={onAddToCart}
                            />
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default ProductCard;