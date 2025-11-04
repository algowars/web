import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useCreateProblemContext } from "../create-problem-context";
import { Language } from "@/features/problems/models/language";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateProblemTestSuitesFormProps {
  onSubmit: (data: { languageId: number; versionId: number }) => void;
}

const createSetupForm = z.object({
  languageId: z.number().min(1, "Please select a language"),
  versionId: z.number().min(1, "Please select a version"),
});

type FormValues = z.infer<typeof createSetupForm>;

export default function CreateProblemTestSuitesForm({
  onSubmit,
}: CreateProblemTestSuitesFormProps) {
  const { availableLanguages } = useCreateProblemContext();

  const form = useForm<FormValues>({
    resolver: zodResolver(createSetupForm),
    defaultValues: {
      languageId: 0,
      versionId: 0,
    },
  });

  const selectedLanguage: Language | null = useMemo(
    () =>
      availableLanguages?.data?.find(
        (language) => language.id === form.getValues().languageId
      ) ?? null,
    [availableLanguages?.data, form.watch("languageId")]
  );

  const versions = selectedLanguage?.versions ?? [];

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="languageId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(val: string) => {
                    const n = val ? Number(val) : 0;
                    field.onChange(n);
                    form.setValue("versionId", 0);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {availableLanguages?.data?.map((language) => (
                        <SelectItem
                          key={language.id}
                          value={String(language.id)}
                        >
                          {language.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="versionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Version</FormLabel>
              <FormControl>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(val: string) => field.onChange(Number(val))}
                  disabled={versions.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        versions.length === 0
                          ? "Select a language first"
                          : "Select a version"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {versions.map((v) => (
                        <SelectItem key={v.id} value={String(v.id)}>
                          {v.version}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </Form>
  );
}
