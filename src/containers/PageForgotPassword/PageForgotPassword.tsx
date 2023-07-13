import React, { useState } from "react";
import Label from "components/Label/Label";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Input from "shared/Input/Input";
import CommonLayout from "containers/AccountPage/CommonLayout";
import authenticationService from "api/authenticationApi";
import toast from "react-hot-toast";
import { Box, CircularProgress, Dialog, DialogContent, Typography } from "@mui/material";

const PageForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  const handeVerifyCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVerifyCode(event.target.value);
  };

  const handleResetPasswordEmail = async () => {
    try
    {
      if (email=="")
      {
        toast.error("Vui lòng nhập email")
        return;
      }
      setIsProcessing(true);
      await authenticationService.resetPasswordEmail(email)
      toast.success("Email chứa mã xác nhận đã được gửi đến bạn")
      setIsEmailVerified(true);
    }
    catch(error: any)
    {
      toast(error.response.data.messageDescription);
    }
    finally
    {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try
    {
      if (newPassword!="" && newPassword != confirmPassword)
      {
        toast.error("Mật khẩu và xác nhận mật khẩu không trùng nhau");
        return;
      }
      setIsProcessing(true);
      await authenticationService.resetPassword(email,newPassword,verifyCode);
      window.location.href = "/login" 
      toast.success("Đặt lại mật khẩu thành công")
    }
    catch(error: any)
    {
      toast(error.response.data.messageDescription);
    }
    finally
    {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="container pt-14 sm:pt-20 pb-24 lg:pb-32">
        <div className="space-y-6 sm:space-y-8">
          {/* HEADING */}
          <h2 className="text-3xl font-semibold">Quên mật khẩu</h2>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
          <div className="max-w-xl space-y-6">
            {isEmailVerified ? (
              <form onSubmit={handleSubmit}>
                <div>
                  <Label>Email</Label>
                  <Input type="email" className="mt-1.5" value={email} disabled />
                </div>
                <div>
                  <Label>Mật khẩu mới</Label>
                  <Input
                    type="password"
                    className="mt-1.5"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                  />
                </div>
                <div>
                  <Label>Nhập lại mật khẩu</Label>
                  <Input
                    type="password"
                    className="mt-1.5"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                </div>
                <span className="mt-1.5">Một email chứa mã xác nhận đã được gửi đến bạn. Vui lòng kiểm tra email</span>
                <div>
                  <Label>Mã xác nhận</Label>
                  <Input
                    type="text"
                    className="mt-1.5"
                    value={verifyCode}
                    onChange={handeVerifyCodeChange}
                  />
                </div>
                <div className="pt-2">
                  <ButtonPrimary type="submit">Cập nhật</ButtonPrimary>
                </div>
              </form>
            ) : (
              <div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" className="mt-1.5" value={email} onChange={handleEmailChange} />
                </div>
                <div className="pt-2">
                  <ButtonPrimary onClick={handleResetPasswordEmail}>Đặt lại mật khẩu</ButtonPrimary>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={isProcessing}>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Đang xử lý...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PageForgotPassword;
