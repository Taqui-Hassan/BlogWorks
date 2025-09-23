import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "../index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            Content: post?.Content || "",
            status: post?.status || "active",
        },

    });

    //button to switch colors
    const [editorTheme, setEditorTheme] = useState('dark');
    const toggleEditorTheme = () => {
        setEditorTheme(currentTheme => (currentTheme === 'dark' ? 'light' : 'dark'));
    };


    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        console.log("Form data:", data);
        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

            if (file) {
                appwriteService.deleteFile(post.FeaturedImg);
            }

            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,    
                FeaturedImg: file ? file.$id : undefined,
            });

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            const file = data.image[0];
            console.log(file)

            if (file) {
                const uploadedFile = await appwriteService.uploadFile(file);
                console.log("yha tk to chal rha h 1")

                if (uploadedFile) {
                    console.log("Uploaded file object:", uploadedFile);
                    data.FeaturedImg = uploadedFile.$id;

                    const dbPost = await appwriteService.createPost({ ...data, UserId: userData.$id });
                    console.log("yeh bhi chal gaya 2")

                    if (dbPost) {
                        navigate(`/post/${dbPost.$id}`);
                    }
                }
                else {
                    console.log("Image is required to create a post.");
                }
            }
            else {

                alert("Please select a featured image to create a new post.");
                return; 
            }
            

        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)}>
            <div className='flex justify-end mb-4'>

                <Button
                    type="button"
                    onClick={toggleEditorTheme}
                    className="bg-gray-500 text-sm cursor-pointer"
                >
                    Toggle Editor Theme
                </Button>
            </div>
            <div className="flex flex-col text-sm">
                <div className="flex justify-around">
                    <div className="text-sm">

                        <Input
                            label="Title :"
                            placeholder="Title"
                            className="mb-4 text-sm"
                            {...register("title", { required: true })}
                        />
                        <Input
                            label="Slug :"
                            placeholder="Slug"
                            className="mb-4 text-sm"
                            {...register("slug", { required: true })}
                            onInput={(e) => {
                                setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                            }}
                        />
                    </div>
                    <div className="text-sm">
                        <Input
                            label="Featured Image :"
                            type="file"
                            className="mb-4 text-xs cursor-pointer"
                            accept="image/png, image/jpg, image/jpeg, image/gif"
                            {...register("image", { required: !post })}
                        />
                        {post && (
                            <div className="mb-4">
                                <img
                                    src={appwriteService.getFilePreview(post.FeaturedImg)}
                                    alt={post.title}
                                    className="rounded-lg"
                                />
                            </div>
                        )}
                        <Select
                            options={["active", "inactive"]}
                            label="Status"
                            className="mb-4 text-sm w-1.5"
                            {...register("status", { required: true })}
                        />
                        <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className='cursor-pointer'>
                            {post ? "Update" : "Submit"}
                        </Button>
                    </div>
                </div>

                <div>
                    <RTE label="Content :" name="Content" control={control} defaultValue={getValues("Content")} theme={editorTheme} />
                </div>
            </div>
        </form>
    );
}