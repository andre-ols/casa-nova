"use client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FC } from "react";
import { useToast } from "../ui/use-toast";

const useMutationSendGift = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendGift,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["gifts"],
      });

      queryClient.prefetchQuery({
        queryKey: ["gifts"],
        queryFn: async () => {
          const response = await fetch(`/api/presentes`);
          const data = await response.json();
          return data;
        },
      });

      const giftedBy = document.getElementById("giftedBy") as HTMLInputElement;
      toast({
        title: `Muito obrigado, ${giftedBy.value}!`,
        description: "O presente foi marcado com seu nome.",
        className: "bg-success-500",
      });
    },

    onError: () => {
      toast({
        title: "Erro ao selecionar presente",
        description: "Por favor, tente novamente mais tarde.",
        className: "bg-yellow-500",
      });
    },
  });
};

const sendGift = async (id: string) => {
  const giftedBy = document.getElementById("giftedBy") as HTMLInputElement;

  const response = await fetch(`/api/presentes/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      giftedBy: giftedBy.value,
    }),
  });
};

export const Gift: FC<{
  id: string;
}> = ({ id }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { mutateAsync, isPending } = useMutationSendGift();

  return (
    <>
      <Button onPress={onOpen} color="success" className="w-full">
        Desejo Presentear
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="bottom-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-black">
                🎁 Presentear
              </ModalHeader>
              <ModalBody>
                <p className="text-black text-sm font-semibold">
                  Ao assinalar a opção &ldquo;Presentear&ldquo;, você estará
                  confirmando que deseja presentear o casal com o item
                  selecionado.
                </p>
                <Input
                  autoFocus
                  label="Nome"
                  placeholder="Digite seu nome completo"
                  variant="bordered"
                  id="giftedBy"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="flat" onPress={onClose}>
                  Fechar
                </Button>
                <Button
                  color="success"
                  onPress={async () => {
                    await mutateAsync(id);
                    onClose();
                  }}
                  isLoading={isPending}
                >
                  Presentear
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
