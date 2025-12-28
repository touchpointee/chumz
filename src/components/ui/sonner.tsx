import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-pink-50 group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-[0_8px_30px_rgba(0,0,0,0.12)] group-[.toaster]:rounded-2xl group-[.toaster]:p-5",
          description: "group-[.toast]:text-muted-foreground font-nunito",
          actionButton:
            "group-[.toast]:bg-brand-pink group-[.toast]:text-white font-semibold shadow-md hover:bg-brand-pink/90",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group-[.toaster]:!bg-green-50 group-[.toaster]:!border-green-200 group-[.toaster]:!text-green-800",
          error:
            "group-[.toaster]:!bg-red-50 group-[.toaster]:!border-red-200 group-[.toaster]:!text-red-900",
          info:
            "group-[.toaster]:!bg-pink-50 group-[.toaster]:!border-pink-200 group-[.toaster]:!text-brand-purple",
          warning:
            "group-[.toaster]:!bg-yellow-50 group-[.toaster]:!border-yellow-200 group-[.toaster]:!text-yellow-800",
          title: "font-poppins font-semibold text-base",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
