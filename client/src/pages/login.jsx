//ftpvLGhsP3HpAKUZ
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authApi"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const[signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const [registerUser,{data:registerData,error:registerError,isLoading:registerIsLoading, isSuccess:registerIsSuccess}] = useRegisterUserMutation();
  const[loginUser,{data:loginData,error:loginError,isLoading:loginIsLoading, isSuccess:loginIsSuccess}] =useLoginUserMutation();
  const navigate= useNavigate();
  const changeInputHandler = (e,type) => {
    const {name,value} = e.target;
    if(type === "signup"){
      setSignupInput({...signupInput, [name]: value});
    } else {
      setLoginInput({...loginInput, [name]: value});
  }};

  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    const action= type === "signup" ? registerUser : loginUser;
    await action(inputData);
  };

  useEffect(() => {
    if(registerIsSuccess && registerData){
      toast.success(resgisterData.message || "Signup successful")
    }
    if(registerError){
      toast.error(registerData.data.message || "Signup failed")
    }
    if(loginIsSuccess && loginData){
      toast.success(loginData.message || "Login successful")
      navigate("/");
    }
    if(loginError){
      toast.error(loginData.data.message || "login failed")
    }
  },[loginIsLoading,registerIsLoading, loginData,registerData, loginError, registerError]);
  return (
    <div className="flex items-center w-full justify-center mt-20">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Create a new account and click signup when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name"
                name="name"
                value={signupInput.name} 
                onChange={(e) => changeInputHandler(e,"signup")}  
                placeholder="Eg. Dhoundiyal" 
                required="true" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Email</Label>
                <Input type="email" 
                name="email"
                value={signupInput.email}
                onChange={(e) => changeInputHandler(e,"signup")}
                placeholder="Eg. ayushdh96@gmail.com" 
                required="true" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Password</Label>
                <Input type="password"
                name="password"
                value={signupInput.password}
                onChange={(e) => changeInputHandler(e,"signup")} 
                placeholder="Strong Password" 
                required="true" />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={registerIsLoading} onClick={()=>handleRegistration("signup")}>
              {
                  registerIsLoading ? (
                    <> <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait </>
                  ) : "Signup"
                }
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login your password here. After signup only can you login here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Email</Label>
                <Input type="email"
                name="email"
                value={loginInput.email} 
                onChange={(e) => changeInputHandler(e,"login")}
                placeholder="ayushdh96@gmail.com" 
                required="true" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">Password</Label>
                <Input type="password"
                name="password"
                value={loginInput.password} 
                onChange={(e) => changeInputHandler(e,"login")}
                placeholder="Strong Password" 
                required="true" />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={loginIsLoading} onClick={()=>handleRegistration("login")}>
                {
                  loginIsLoading ? (
                    <> <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait </>
                  ) : "Login"
                }
                </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>

  )
}

export default Login;