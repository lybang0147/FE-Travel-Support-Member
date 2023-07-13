import { FC, ChangeEvent, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Helmet from 'react-helmet'
import Label from 'components/Label';
import Room from 'models/room';
import { InputAdornment, tooltipClasses } from '@mui/material';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader,
  CardContent,
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField,
  CircularProgress,
  SelectChangeEvent,
  DialogContentText 
} from '@mui/material';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import stayService from 'api/stayApi';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import toast from 'react-hot-toast';
import Stay from 'models/stay';
import RoomService from 'models/roomService';
import Voucher from 'models/voucher';
import { Discount } from '@mui/icons-material';

interface RecentUsersTableProps {
  className?: string;
}

interface Filters {
  status?: boolean;
}

const getStatusLabel = (status: boolean): JSX.Element => {
  const map: { [key: string]: { text: string; color: 'error' | 'success' } } = {
    false: {
      text: 'Bị chặn',
      color: 'error',
    },
    true: {
      text: 'Hoạt động',
      color: 'success',
    },
  };

  const { text, color } = map[status.toString() as keyof typeof map];

  return (
    <Label color={color as 'error' | 'success'}>
      <Typography variant="body1" fontWeight="bold" color="text.primary">
        {text}
      </Typography>
    </Label>
  );
};



const applyPagination = (rooms: Room[], page: number, limit: number): Room[] => {
  return rooms.slice(page * limit, page * limit + limit);
};

type VoucherFields = {
  discount: number;
  expiredDate: string;
  name: string;
  quantity: number;
  roomId: string;
};

const OwnerRoomPageContent: FC<RecentUsersTableProps> = ({}) => {
  const { id } = useParams();
  const [stays, setStays] = useState<Stay[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room>();
  const [editRoomName, setEditRoomName] = useState("");
  const [editGuestNumber, setEditGuestNumber] = useState(0);
  const [editNumberOfRoom, setEditNumberOfRoom] = useState(0);
  const [editPrice, setEditPrice] = useState(0);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [needFetch, setNeedFetch] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [guestNumber, setGuestNumber] = useState(0);
  const [numberOfRoom, setNumberOfRoom] = useState(0);
  const [price, setPrice] = useState(0);
  const [isProcessing , setIsProcessing] = useState<boolean>(false);
  const [currentRoomService, setCurrentRoomService] = useState<RoomService[]>([]);
  const [remainRoomService, setRemainRoomService] = useState<RoomService[]>([]);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [voucherDialogOpen, setVoucherDialogOpen] = useState(false);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [addVoucherDialogOpen, setAddVoucherDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null);
  const [voucherFields, setVoucherFields] = useState<VoucherFields>({
    discount: 0,
    expiredDate: "2023-07-01",
    name: "",
    quantity: 0,
    roomId: "string",
  });
  const [expiredVoucher, setExpiredVoucher] = useState<Voucher[]>([]);
  const [validVoucher, setValidVoucher] = useState<Voucher[]>([]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const fetchRooms = async () => {
      try {
          if (id)
          {
            const roomList = await stayService.getRoomByStay(id);
            setRooms(roomList);
          }
      } catch (error) {
        toast.error('Lỗi khi lấy dữ liệu phòng');
        console.log(error);
      }
    };

    const debounceFetch = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(fetchRooms, 1000);
    };
    debounceFetch();
    return () => {
      clearTimeout(timeoutId);
    };

  }, [needFetch, searchKey]);

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
    setPage(0);
  };


  const paginatedRooms = applyPagination(rooms, page, limit);

  const blueCardCount = stays.length;
  const greenCardCount = stays.length;
  const redCardCount = stays.length;

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleEditDialogOpen = (room: Room) => {
    setSelectedRoom(room);
    setEditRoomName(room.roomName ?? "");
    setEditGuestNumber(room.guestNumber ?? 0);
    setEditNumberOfRoom(room.numberOfRoom ?? 0);
    setEditPrice(room.price ?? 0);
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
  };

  const handleAddRoom = async () =>
  {
    if (roomName == "" || guestNumber == 0 || numberOfRoom == 0 || price<1000)
    {
      toast.error("Các trường không được bỏ trống và tiền thuê phải tối thiểu 1000VND")
      return
    }
    try 
    {
      setIsProcessing(true);
      const data = {roomName: roomName,
        numberOfRoom: numberOfRoom,
        price: price,
        numberOfGuest: guestNumber,
        stayId: id}
      await stayService.createRoom(
          data
      )
      toast.success("Thêm phòng thành công");
      handleDialogClose();
      setNeedFetch(!needFetch);
    }
    catch (error)
    {
      toast.error("Lỗi khi thêm phòng");
    }
    finally {
      setIsProcessing(false);
    }
  }

  const handleUpdateRoom = async () => {
    if (editRoomName == "" || editGuestNumber == 0 || editNumberOfRoom == 0 || editPrice<1000)
    {
      toast.error("Các trường không được bỏ trống và tiền thuê phải tối thiểu 1000VND")
      return
    }
    try 
    {
      setIsProcessing(true);
      const data = {roomName: editRoomName,
        numberOfRoom: editNumberOfRoom,
        price: editPrice,
        numberOfGuest: editGuestNumber}
      await stayService.updateRoom(selectedRoom?.id ?? "", data);
      toast.success("Cập nhật thông tin phòng thành công");
      handleEditDialogClose();
      setNeedFetch(!needFetch);
    }
    catch (error)
    {
      toast.error("Lỗi khi cập nhật phòng");
    }
    finally {
      setIsProcessing(false);
    }
  }

  const handleGuestNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setGuestNumber(value);
    }
  };
  
  const handleNumberOfRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setNumberOfRoom(value);
    }
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setPrice(value);
    }
  };

  const handleAddRoomService = (service: RoomService) => {
    setCurrentRoomService([...currentRoomService, service]);
    setRemainRoomService(remainRoomService.filter((item) => item.id !== service.id));
  };

  const handleRemoveRoomService = (service: RoomService) => {
    setCurrentRoomService(currentRoomService.filter((item) => item.id !== service.id));
    setRemainRoomService([...remainRoomService, service]);
  };


  const handleOpenServiceDialog = async (room: Room) => {
    try
    {
      const listService = await stayService.getAllRoomService();
      const currentService = await stayService.getRoomService(room?.id ?? "");
      setSelectedRoom(room);
      setCurrentRoomService(currentService);
      setRemainRoomService(listService.filter((item) => !currentService.some((service) => service.id === item.id)));
      setServiceDialogOpen(true);
    } catch(error)
    {
      toast.error("Lỗi khi lấy dữ liệu dịch vụ phòng");
    }
  };

  const handleOpenVoucherDialog = async (room: Room) => { 
    try {
      const voucher = await stayService.getRoomVoucher(room.id);
      const currentDateTime = new Date(); // Get the current date and time

      const expiredVouchers = voucher.filter(v => new Date(v.expirationDate) <= currentDateTime);
      const validVouchers = voucher.filter(v => new Date(v.expirationDate) > currentDateTime);
      setExpiredVoucher(expiredVouchers);
      setValidVoucher(validVouchers);
      
      setSelectedRoom(room);
      setVoucherDialogOpen(true);
    }
    catch (error)
    {
      toast.error("Lỗi khi lấy dữ liệu voucher");
    }
  }

  const handleCloseServiceDialog = () => {
    setServiceDialogOpen(false);
  };

  const handleCloseRoomVocherDialog = () => {
    setVoucherDialogOpen(false);
  }


  const handleSaveRoomService = async () => {
    try
    {
      const serivceIds = currentRoomService.map((item) => item.id);
      setIsProcessing(true);
      await stayService.addRoomSerivce(selectedRoom?.id ?? "",serivceIds);
      toast.success("Chỉnh sửa dịch vụ phòng thành công")
      setServiceDialogOpen(false);
      setNeedFetch(!needFetch);
    }
    catch(error)
    {
      toast.error("Lỗi khi thêm dịch vụ");
    }
    finally
    {
      setIsProcessing(false);
    } 
  }

  const handleAddVoucherDialogOpen = (room: Room) => {
    setSelectedRoom(room);
    setAddVoucherDialogOpen(true);
  };

  const handleAddVoucherDialogClose = () => {
    setSelectedRoom(undefined);
    setAddVoucherDialogOpen(false);
  };

  const handleAddVoucher = async () => {
    if (voucherFields.name=="" || voucherFields.discount==0 || voucherFields.expiredDate=="" || voucherFields.quantity==0)
    {
      toast.error("Vui lòng điền đầy đủ các trường");
      return
    }
    try
    {
      voucherFields.roomId = selectedRoom?.id ?? "";
      voucherFields.expiredDate=voucherFields.expiredDate.concat("T00:00:00.000Z");
      setIsProcessing(true);
      await stayService.addRoomVoucher(voucherFields);
      handleAddVoucherDialogClose();
      toast.success("Thêm voucher thành công")
      setNeedFetch(!needFetch)
    }
    catch(error)
    {
      toast.error("Lỗi khi thêm voucher")
    }
    finally{
      setIsProcessing(false);
    }
  };

  const activeVoucher = async (id: string) =>
  {
    try
    {
      setIsProcessing(true);
      await stayService.activeRoomVoucher(id);
      toast.success("Kích hoạt voucher thành công")
      setNeedFetch(!needFetch);
      handleCloseRoomVocherDialog();
    }
    catch (error)
    {
      toast.error("Lỗi khi kích hoạt voucher")
    }
    finally
    {
      setIsProcessing(false);
    }
  }

  const handleVoucherFieldChange = (field: keyof VoucherFields, value: string | number) => {
    if (field === "discount") {
      const maxValue = 100; 
      value = Math.min(value as number, maxValue);
    }
    setVoucherFields((prevFields) => ({
      ...prevFields,
      [field]: value,
    }));
  };
  
  const theme = useTheme();
  return (
    <div>
      <Helmet>
        <title>UTEOwner</title>
      </Helmet>
      <Box p={2} display="flex" justifyContent="space-between">
        <Card sx={{ backgroundColor: '#1976d2', color: '#fff', width: 300 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {blueCardCount}
            </Typography>
            <Typography variant="body2" component="div">
              Tổng số tài khoản
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ backgroundColor: '#4caf50', color: '#fff', width: 300 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {greenCardCount}
            </Typography>
            <Typography variant="body2" component="div">
              Tài khoản đang hoạt động
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ backgroundColor: '#f44336', color: '#fff', width: 300 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {redCardCount}
            </Typography>
            <Typography variant="body2" component="div">
              Tài khoản bị khóa
            </Typography>
          </CardContent>
        </Card>
      </Box>
    <Card>
    <CardHeader
      title={
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quản lý phòng
        </Typography>
      }
      action={
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={handleDialogOpen}>
              Thêm phòng
            </Button>
          <Box mr={1}>
            <TextField
              label="Tìm kiếm"
              variant="outlined"
              size="small"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </Box>
        </div>
      }
    />
      <Divider />
      <TableContainer>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Tên hiển thị</TableCell>
        <TableCell>Số lượng khách</TableCell>
        <TableCell>Số lượng phòng</TableCell>
        <TableCell align="right">Giá tiền</TableCell> 
        <TableCell align="right">Trạng thái</TableCell>
        <TableCell align="right">Dịch Vụ</TableCell>
        <TableCell align="right">Voucher</TableCell>
        <TableCell align="right">Hành động</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {paginatedRooms.map((rooms) => {
        return (
          <TableRow hover key={rooms.id}>
            <TableCell>
              <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                {rooms.roomName}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                {rooms.guestNumber}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                {rooms.numberOfRoom}
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                {rooms.price?.toLocaleString("vn")}
              </Typography>
            </TableCell>
            <TableCell align="right">{getStatusLabel(rooms.hidden === false)}</TableCell>
            <TableCell align="right">
              <Button onClick={() => handleOpenServiceDialog(rooms)}>Xem dịch vụ</Button>
            </TableCell>
            <TableCell align="right">
              <Button onClick={() => handleOpenVoucherDialog(rooms)}>Xem voucher</Button>
            </TableCell>
            <TableCell align="right">
              <Tooltip title="Thay đổi thông tin" arrow>
                <IconButton
                  sx={{
                    '&:hover': { background: theme.palette.success.light },
                    color: theme.palette.success.main,
                  }}
                  color="inherit"
                  size="small"
                  onClick={() => handleEditDialogOpen(rooms)}
                >
                  <EditTwoToneIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Thêm voucher" arrow>
                <IconButton
                  sx={{
                    '&:hover': { background: theme.palette.info.light },
                    color: theme.palette.info.main,
                  }}
                  color="inherit"
                  size="small"
                  onClick={() => handleAddVoucherDialogOpen(rooms)}
                >
                  <Discount fontSize="small" />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
</TableContainer>

      <Box p={2}>
        <TablePagination
          component="div"
          count={rooms.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
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

      <Dialog open={openDialog} onClose={handleDialogClose}>
  <DialogTitle>Thêm Phòng</DialogTitle>
  <DialogContent>
    <TextField
      label="Tên phòng"
      variant="outlined"
      fullWidth
      margin="normal"
      value={roomName}
      onChange={(e) => setRoomName(e.target.value)}
    />
    <TextField
      label="Số lượng khách"
      variant="outlined"
      fullWidth
      margin="normal"
      type="number"
      value={guestNumber}
      onChange={handleGuestNumberChange}
    />
    <TextField
      label="Số lượng phòng"
      variant="outlined"
      fullWidth
      margin="normal"
      type="number"
      value={numberOfRoom}
      onChange={handleNumberOfRoomChange}
    />
    <TextField
      label="Giá tiền"
      variant="outlined"
      fullWidth
      margin="normal"
      type="number"
      value={price}
      onChange={handlePriceChange}
      InputProps={{
        endAdornment: <InputAdornment position="end">VND</InputAdornment>,
      }}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleDialogClose}>Hủy bỏ</Button>
    <Button onClick={handleAddRoom} color="primary">
      Thêm
    </Button>
  </DialogActions>
</Dialog>

<Dialog open={openEditDialog} onClose={handleEditDialogClose}>
  <DialogTitle>Chỉnh sửa thông tin phòng</DialogTitle>
  <DialogContent>
  <TextField
  label="Tên phòng"
  variant="outlined"
  fullWidth
  margin="normal"
  value={editRoomName}
  onChange={(e) => setEditRoomName(e.target.value)}
/>
    <TextField
      label="Số lượng khách"
      variant="outlined"
      fullWidth
      margin="normal"
      type="number"
      value={editGuestNumber}
      onChange={(e) => setEditGuestNumber(parseInt(e.target.value))}
    />
    <TextField
      label="Số lượng phòng"
      variant="outlined"
      fullWidth
      margin="normal"
      type="number"
      value={editNumberOfRoom}
      onChange={(e) => setEditNumberOfRoom(parseInt(e.target.value))}
    />
    <TextField
      label="Giá tiền"
      variant="outlined"
      fullWidth
      margin="normal"
      type="number"
      value={editPrice}
      onChange={(e) => setEditPrice(parseInt(e.target.value))}
      InputProps={{
        endAdornment: <InputAdornment position="end">VND</InputAdornment>,
      }}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleEditDialogClose}>Hủy bỏ</Button>
    <Button onClick={handleUpdateRoom} color="primary">
      Chỉnh sửa
    </Button>
  </DialogActions>
</Dialog>

<Dialog open={serviceDialogOpen} onClose={handleCloseServiceDialog}>
  <DialogTitle>Dịch vụ phòng</DialogTitle>
  <DialogContent>
    <div>
      <h4>Dịch vụ phòng có thể áp dụng:</h4>
      {remainRoomService.map((service) => (
        <Button style={{ marginBottom: '0.2rem', marginLeft: '0.5rem', background: '#0080FF', color: 'white', padding: '0.5rem', borderRadius: '0.25rem' }} key={service.id} onClick={() => handleAddRoomService(service)}>
          {service.roomServiceName}
        </Button>
      ))}
    </div>
    <div>
      <h4>Dịch vụ phòng hiện có:</h4>
      {currentRoomService.map((service) => (
        <Button style={{ marginBottom: '0.2rem', marginLeft: '0.5rem', background: '#0080FF', color: 'white', padding: '0.5rem', borderRadius: '0.25rem' }} key={service.id} onClick={() => handleRemoveRoomService(service)}>
          {service.roomServiceName}
        </Button>
      ))}
    </div>
  </DialogContent>
  <DialogActions>
  <Button onClick={handleSaveRoomService} color="primary">
      Lưu
    </Button>
    <Button onClick={handleCloseServiceDialog} color="primary">
      Đóng
    </Button>
  </DialogActions>
</Dialog>

<Dialog open={voucherDialogOpen} onClose={handleCloseRoomVocherDialog}>
  <DialogTitle>Voucher</DialogTitle>
  <DialogContent>
    <div>
      <h4>Voucher hiện tại:</h4>
      {validVoucher.map((voucher) => {
      const expirationDate = new Date(voucher.expirationDate);
      const formattedExpirationDate = expirationDate.toLocaleDateString();
        return (
          <Tooltip
            key={voucher.id}
            title={
              <>
                <span>Tên: {voucher.name}</span>
                <br />
                <span>Ngày hết hạn: {formattedExpirationDate}</span>
                <br />
                <span>Giảm giá: {voucher.discount}%</span>
                <br />
                <span>Số lượng: {voucher.quantity}</span>
                <br />
                <span>Sử dụng: {voucher.remainingQuantity}</span>
              </>
            }
            placement="top"
          >
            <Button
              style={{
                marginBottom: '0.2rem',
                marginLeft: '0.5rem',
                background: voucher.hidden ? 'grey' : '#0080FF',
                color: 'white',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                cursor: voucher.hidden ? 'pointer' : 'default',
              }}
              onClick={() => {
                if (voucher.hidden) {
                  setSelectedVoucherId(voucher.id);
                  setConfirmationDialogOpen(true);
                }
              }}
            >
              {voucher.name}
            </Button>
          </Tooltip>
        );
      })}
    </div>
    <div>
      <h4>Voucher đã hết hạn:</h4>
      {expiredVoucher.map((voucher) => {
        const expirationDate = new Date(voucher.expirationDate);
        const formattedExpirationDate = expirationDate.toLocaleDateString(); // Format the expiration date as needed

        return (
          <Tooltip
            key={voucher.id}
            title={
              <>
                <span>Tên: {voucher.name}</span>
                <br />
                <span>Ngày hết hạn: {formattedExpirationDate}</span>
                <br />
                <span>Giảm giá: {voucher.discount}%</span>
                <br />
                <span>Số lượng: {voucher.quantity}</span>
                <br />
                <span>Sử dụng: {voucher.remainingQuantity}</span>
              </>
            }
            placement="top"
          >
            <Button
              style={{
                marginBottom: '0.2rem',
                marginLeft: '0.5rem',
                background: '#0080FF',
                color: 'white',
                padding: '0.5rem',
                borderRadius: '0.25rem',
              }}
              key={voucher.id}
            >
              {voucher.name}
            </Button>
          </Tooltip>
        );
      })}
    </div>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseRoomVocherDialog} color="primary">
      Đóng
    </Button>
  </DialogActions>
</Dialog>

<Dialog open={confirmationDialogOpen} onClose={() => setConfirmationDialogOpen(false)}>
  <DialogTitle>Confirmation</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Bạn có chắc chắn muốn kích hoạt voucher?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => {
        setConfirmationDialogOpen(false);
        if (selectedVoucherId) {
          activeVoucher(selectedVoucherId);
        }
        setSelectedVoucherId(null);
      }}
      color="primary"
    >
      Xác nhận
    </Button>
    <Button onClick={() => setConfirmationDialogOpen(false)} color="primary">
      Hủy
    </Button>
  </DialogActions>
</Dialog>

<Dialog open={addVoucherDialogOpen} onClose={handleAddVoucherDialogClose} maxWidth="lg">
<DialogTitle>Thêm voucher</DialogTitle>
  <DialogContent>
    <Box display="flex" flexDirection="column" alignItems="center">
      <TextField
        label="% Giảm giá"
        value={voucherFields.discount}
        fullWidth
        onChange={(e) => handleVoucherFieldChange("discount", e.target.value!="" ? parseInt(e.target.value) : 0)}
        style={{ marginBottom: "1rem", marginTop: "1rem" }}
      />
      <TextField
        label="Ngày hết hạn"
        type="date"
        value={voucherFields.expiredDate}
        fullWidth
        onChange={(e) => handleVoucherFieldChange("expiredDate", e.target.value)}
        style={{ marginBottom: "1rem" }}
      />
      <TextField
        label="Tên voucher"
        value={voucherFields.name}
        onChange={(e) => handleVoucherFieldChange("name", e.target.value)}
        fullWidth
        style={{ marginBottom: "1rem" }}
      />
      <TextField
        label="Số lượng"
        value={voucherFields.quantity}
        fullWidth
        onChange={(e) => handleVoucherFieldChange("quantity", e.target.value!="" ? parseInt(e.target.value) : 0)}
        style={{ marginBottom: "1rem" }}
      />
      <Box display="flex" justifyContent="space-between" width="100%">
        <Button onClick={handleAddVoucher} color="primary">
          Thêm Voucher
        </Button>
        <Button onClick={handleAddVoucherDialogClose}>Đóng</Button>
      </Box>
    </Box>
  </DialogContent>
</Dialog>
    </div>
  );
};

export default OwnerRoomPageContent;
