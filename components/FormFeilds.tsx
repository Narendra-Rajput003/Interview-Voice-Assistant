import React from 'react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Controller, Control, FieldValues, Path } from "react-hook-form";


interface FormFieldProps <T extends FieldValues>{
    control:Control<T>;
    name:Path<T>;
    label:string;
    placeholder?:string;
    type?:"text" | "email" | "password"
}

const FormFeilds=< T extends FieldValues >({
  control,
  name,
  label,
  placeholder,
  type="text",
}:FormFieldProps<T>)=> {
  return (
    <FormField
            control={control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input 
                  className='input'
                  type={type}
                  placeholder={placeholder}
                  {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
  )
}

export default FormFeilds