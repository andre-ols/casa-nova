"use client";
import { GiftItem } from "@/types/GiftItem";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Spacer,
  Textarea,
} from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

const categories = ["Cozinha", "Sala", "Quarto", "Banheiro"];

export default function CreateItem() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    name: string;
    description: string;
    category: string;
    frontImage: FileList;
    images: FileList;
  }>();

  const [frontImagePreview, setFrontImagePreview] = useState<
    string | ArrayBuffer | null
  >(null);
  const [imagesPreview, setImagesPreview] = useState<
    Array<string | ArrayBuffer | null>
  >([]);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data: any) => {
    setIsLoading(true);
    console.log(data);

    const formData = new FormData();

    const frontImage = new File(
      [data.frontImage[0]],
      `${data.name}-front.png`,
      {
        type: "image/png",
      }
    );

    formData.append("frontImage", frontImage);

    const images = Array.from(data.images as File[]).map(
      (image: File, index) => {
        return new File([image], `${data.name}-${index}.png`, {
          type: "image/png",
        });
      }
    );

    images.forEach((image) => {
      formData.append("images", image);
    });

    const gift: Omit<GiftItem, "id"> = {
      name: data.name,
      description: data.description,
      category: data.category,
      status: "Disponível",
      giftedBy: [],
      personForGift: 1,
    };

    Object.entries(gift).forEach(([key, value]) => {
      formData.append(key, value);
    });
    fetch("http://localhost:3000/api/presentes", {
      method: "POST",
      body: formData,
    }).then(() => {
      setIsLoading(false);
    });
  };

  // Generate previews when images are selected
  const generateFrontImagePreview = (file: FileList) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFrontImagePreview(reader.result);
    };
    reader.readAsDataURL(file[0]);
  };

  const generateImagesPreview = (files: FileList) => {
    const previews = Array.from(files).map((file) => {
      console.log(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagesPreview((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
      return reader.result;
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 max-w-lg flex flex-col gap-5 bg-white shadow-md rounded-lg"
    >
      <div className="flex flex-col gap-2">
        <Input
          type="text"
          label="Nome"
          id="name"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <span className="text-red-500 text-xs">{errors.name.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Textarea
          type="text"
          label="Descrição"
          id="description"
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <span className="text-red-500 text-xs">
            {errors.description.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Select
          label="Categoria"
          id="category"
          {...register("category", { required: "Category is required" })}
        >
          {categories.map((category) => (
            <SelectItem
              className="text-zinc-800"
              key={category}
              value={category}
            >
              {category}
            </SelectItem>
          ))}
        </Select>
        {errors.category && (
          <span className="text-red-500 text-xs">
            {errors.category.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-zinc-800">Imagem da frente</label>
        <input
          type="file"
          {...register("frontImage", { required: "Front image is required" })}
          className="block w-full"
          onChange={(e) => generateFrontImagePreview(e.target.files!)}
        />
        {errors.frontImage && (
          <span className="text-red-500 text-xs">
            {errors.frontImage.message}
          </span>
        )}
        {frontImagePreview && (
          <Image
            src={frontImagePreview}
            width={96}
            height={96}
            alt="Front Image Preview"
            className="mt-2 w-24 h-24 object-contain"
          />
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-2">Images</label>
        <input
          type="file"
          multiple
          {...register("images")}
          className="block w-full"
          onChange={(e) => generateImagesPreview(e.target.files!)}
        />
        <div className="mt-2 flex space-x-2">
          {imagesPreview.map((image, index) => (
            <Image
              key={index}
              src={image}
              width={96}
              height={96}
              alt={`Image ${index + 1}`}
              className="object-contain"
            />
          ))}
        </div>
      </div>
      <Spacer y={1} />
      <Button type="submit" color="primary" isLoading={isLoading}>
        Submit
      </Button>
    </form>
  );
}
