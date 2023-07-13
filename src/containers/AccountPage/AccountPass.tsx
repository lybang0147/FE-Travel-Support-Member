import Label from "components/Label/Label";
import React, { useState, ChangeEvent, FormEvent } from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Input from "shared/Input/Input";
import CommonLayout from "./CommonLayout";
import { Box, CircularProgress, Dialog, DialogContent, Typography } from "@mui/material";
import authenticationService from "api/authenticationApi";
import toast from "react-hot-toast";

const AccountPass = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const handleCurrentPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword=="" && newPassword!=confirmPassword)
    {
      toast.error("Mật khẩu và xác nhận mật khẩu không trùng nhau");
      return;
    }
    try
    {
      setIsProcessing(true);
      await authenticationService.changePassword({
        oldPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      })
      toast.success("Thay đổi mật khẩu thành công")
    }
    catch (error: any)
    {
      toast.error(error.response.data.messageDescription);
    }
    finally
    {
      setIsProcessing(false);
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div>
      <CommonLayout>
        <div className="space-y-6 sm:space-y-8">
          {/* HEADING */}
          <h2 className="text-3xl font-semibold">Thay đổi mật khẩu</h2>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
          <div className="max-w-xl space-y-6">
            <form onSubmit={handleSubmit}>
              <div>
                <Label>Mật khẩu hiện tại</Label>
                <Input
                  type="password"
                  className="mt-1.5"
                  value={currentPassword}
                  onChange={handleCurrentPasswordChange}
                />
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
              <div className="pt-2">
                <ButtonPrimary type="submit">Cập nhật</ButtonPrimary>
              </div>
            </form>
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
      </CommonLayout>
    </div>
  );
};

export default AccountPass;
