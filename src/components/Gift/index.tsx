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
import { FC, useState } from "react";

export const Gift: FC<{
  id: string;
}> = ({ id }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isLoading, setIsLoading] = useState(false);

  const sendGift = async () => {
    // send gift

    setIsLoading(true);
    try {
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

      if (response.ok) {
        console.log("Gift sent");
      } else {
        console.error("Failed to send gift");
      }
    } catch (error) {
      console.error("Failed to send gift", error);
    }

    setIsLoading(false);
  };

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
                    await sendGift();
                    onClose();
                  }}
                  isLoading={isLoading}
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
