import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateProblemTestSuitesFormProps {
  onSubmit: (data: { languageId: number; versionId: number }) => void;
}

export const createSetupForm = z.object({
  languageId: z.number().min(1, "Please select a language"),
  versionId: z.number().min(1, "Please select a version"),
});

const languages = [
  {
    id: 1,
    name: "JavaScript",
    versions: [
      { id: 101, name: "ES6" },
      { id: 102, name: "ES2020" },
    ],
  },
  {
    id: 2,
    name: "Python",
    versions: [
      { id: 201, name: "3.8" },
      { id: 202, name: "3.11" },
    ],
  },
  {
    id: 3,
    name: "Java",
    versions: [
      { id: 301, name: "8" },
      { id: 302, name: "17" },
    ],
  },
];

export default function CreateProblemTestSuitesForm({
  onSubmit,
}: CreateProblemTestSuitesFormProps) {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [versionOpen, setVersionOpen] = useState(false);

  const form = useForm<z.infer<typeof createSetupForm>>({
    resolver: zodResolver(createSetupForm),
    defaultValues: {
      languageId: 0,
      versionId: 0,
    },
  });

  const selectedLanguage = languages.find(
    (lang) => lang.id === form.watch("languageId")
  );
  const selectedVersion = selectedLanguage?.versions.find(
    (version) => version.id === form.watch("versionId")
  );

  const handleSubmit = (values: z.infer<typeof createSetupForm>) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="languageId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Language</FormLabel>
              <Popover open={languageOpen} onOpenChange={setLanguageOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? languages.find(
                            (language) => language.id === field.value
                          )?.name
                        : "Select language"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandList>
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        {languages.map((language) => (
                          <CommandItem
                            value={language.name}
                            key={language.id}
                            onSelect={() => {
                              form.setValue("languageId", language.id);
                              form.setValue("versionId", 0); // Reset version when language changes
                              setLanguageOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                language.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {language.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="versionId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Version</FormLabel>
              <Popover open={versionOpen} onOpenChange={setVersionOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={!selectedLanguage}
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value && selectedLanguage && selectedVersion
                        ? `${selectedLanguage.name} ${selectedVersion.name}`
                        : "Select version"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search version..." />
                    <CommandList>
                      <CommandEmpty>No version found.</CommandEmpty>
                      {selectedLanguage && (
                        <CommandGroup heading={selectedLanguage.name}>
                          {selectedLanguage.versions.map((version) => (
                            <CommandItem
                              value={`${selectedLanguage.name} ${version.name}`}
                              key={version.id}
                              onSelect={() => {
                                form.setValue("versionId", version.id);
                                setVersionOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  version.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {version.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Create Test Suite
        </Button>
      </form>
    </Form>
  );
}
