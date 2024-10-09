import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { Breadcrumb, BreadcrumbItem , BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from '../../../api'


const EditProfile = () => {

  const navigate = useNavigate();
  const [currUser, setCurrUser] = useState(null);

  const { control, handleSubmit, register, reset, formState: { errors } } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      contact: "",
      password:"",
      address: "",
      
    },
  });

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await api.get("/api/user/myProfile");
        const userData = response.data?.user[0];

        setCurrUser(userData);

        reset({
          fullName: userData.fullName,
          email: userData.email,
          contact: userData.contact,
          password:userData.password,
          address: userData.address,
         
        });
      } catch (error) {
        toast.error("Failed to load user profile");
        console.error("User Fetch Error:", error);
      }
    };

 
    getCurrentUser();
  }, [reset]);

  const onSubmit = async (data) => {
    const formattedData = {
      ...data
    };


    try {
      const updatedUser = await api.put(`/api/user/updateUserRecord/${currUser._id}`, formattedData);
      toast.success(" Profile updated successfully");
      navigate("/dashboard/teamlead/team");
    } catch (error) {
      if (error.response) {
        toast.error(`Server Error: ${error.response.data.message || 'An error occurred'}`);
      } 
    }
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><Link to="/dashboard/teamlead">Home</Link></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><Link to="/dashboard/teamlead/team">Users</Link></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><Link to="#">Edit</Link></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex gap-4">
          <Link to="/dashboard/teamlead/team">
            <Button variant="outline" className="hover:bg-yellow-500 rounded-3xl">Cancel</Button>
          </Link>
          <Button type="submit" className="bg-[#BA0D09] hover:bg-[#BA0D09] rounded-3xl" onClick={handleSubmit(onSubmit)}>Submit</Button>
        </div>
      </div>

      <Card className="mt-4 pb-8 rounded-3xl shadow-sm shadow-green-50">
        <CardHeader>
          <CardTitle className="text-[#0067B8] text-2xl font-[Liberation Mono]">Edit Profile</CardTitle>
          <CardDescription className="text-[#000] text-sm font-[Liberation Mono]">Fill out the form below to edit Profile</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
            <div className="w-full">
              <label htmlFor="fullName" className="block mb-2 font-medium">Full Name</label>
              <Input id="fullName" className="w-full rounded-3xl" {...register("fullName", { required: "Full name is required" })} />
              {errors.fullName && <p className="text-red-500">{errors.fullName.message}</p>}
            </div>

            <div className="w-full">
              <label htmlFor="email" className="block mb-2 font-medium">Email</label>
              <Input id="email" type="email" className="w-full rounded-3xl" {...register("email", { required: "Email is required" })} />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            <div className="w-full">
              <label htmlFor="password" className="block mb-2 font-medium">Password</label>
              <Input id="password" type="password" className="w-full rounded-3xl" {...register("password", { required: "Password is required" })} />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>

            <div className="w-full">
              <label htmlFor="contact" className="block mb-2 font-medium">Contact No</label>
              <Input id="contact" className="w-full rounded-3xl" {...register("contact", { required: "Contact is required" })} />
              {errors.contact && <p className="text-red-500">{errors.contact.message}</p>}
            </div>

            <div className="w-full">
              <label htmlFor="address" className="block mb-2 font-medium">Address</label>
              <Input id="address" className="w-full rounded-3xl" {...register("address", { required: "Address is required" })} />
              {errors.address && <p className="text-red-500">{errors.address.message}</p>}
            </div>

         
          </form>
        </CardContent>
      </Card>

    </section>
  );
};

export default EditProfile;
