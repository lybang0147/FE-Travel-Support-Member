import { FC, ChangeEvent, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import User from 'models/user';
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import authenticationService from 'api/authenticationApi';
import Helmet from 'react-helmet'
import Label from 'components/Label';
import stayService from 'api/stayApi';
import PageAddListing1 from 'containers/PageAddListing1/PageAddListing1';
import { Link } from 'react-router-dom';
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
} from '@mui/material';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import CheckIcon from '@mui/icons-material/Check';
import { MeetingRoom } from '@mui/icons-material';
import toast from 'react-hot-toast';
import Stay from 'models/stay';
import { EventAvailable } from '@mui/icons-material';
import { Booking } from 'models/booking';

interface RecentUsersTableProps {
  className?: string;
}

interface Filters {
  status?: number;
}

const getStatusLabel = (status: number): JSX.Element => {
  const map: { [key: number]: { text: string; color: string } } = {
    1: {
      text: 'Đã thanh toán',
      color: 'primary', 
    },
    2: {
      text: 'Đã chấp nhận',
      color: 'secondary'
    },
    3: {
      text: 'Đã từ chối',
      color: 'error',
    },
    4: {
      text: 'Khách hàng hủy đặt',
      color: 'warning',
    },
    5: {
      text: 'Đã thanh toán',
      color: 'success', 
    },
  };

  const { text, color } = map[status];

  return (
    <Label color={color as 'primary' | 'warning' | 'error' | 'success'}>
      <Typography variant="body1" fontWeight="bold" color="text.primary">
        {text}
      </Typography>
    </Label>
  );
};



const applyPagination = (bookings: Booking[], page: number, limit: number): Booking[] => {
  return bookings.slice(page * limit, page * limit + limit);
};

const OwnerBookingPageContent: FC<RecentUsersTableProps> = ({}) => {
  const [reasonDialogOpen, setReasonDialogOpen] = useState<boolean>(false);
  const [stays, setStays] = useState<Stay[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [needFetch, setNeedFetch] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchKey, setSearchKey] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [ownerData, setOwnerData] = useState({
    email: "",
    phone: "",
    fullName: "",
    gender: "",
    password: ""
  });
  const [filters, setFilters] = useState<Filters>({
    status: undefined,
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const fetchStays = async () => {
      try {
        const stayList = await stayService.getOwnerBooking(searchKey);
        setBookings(stayList.content);
      } catch (error) {
        toast.error('Lỗi khi lấy dữ liệu đặt phòng');
        console.log(error);
      }
    };

    const debounceFetch = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(fetchStays, 1000);
    };
    debounceFetch();
    return () => {
      clearTimeout(timeoutId);
    };

  }, [needFetch, searchKey]);

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
    setSelectedStatus(null);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
    setPage(0);
  };

  const handleImageClick = (imageLink: string): void => {
    setSelectedImage(imageLink);
    setIsImageDialogOpen(true);
  };

  const handleImageDialogClose = (): void => {
    setIsImageDialogOpen(false);
  };

  const paginatedBookings = applyPagination(bookings, page, limit);

  const blueCardCount = bookings.length;
  const greenCardCount = bookings.length;
  const redCardCount = bookings.length;
  

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    const parsedValue = selectedValue === "both" ? null : selectedValue === "true";
    setSelectedStatus(parsedValue !== null ? parsedValue.toString() : null);
  };

  const handleAcceptBooking = async (id: string) => {
    try
    {
      setIsProcessing(true);
      await stayService.acceptBooking(id);
      toast.success("Chấp nhận đặt phòng thành công");
      setNeedFetch(!needFetch);
    }
    catch (error)
    {
      toast.error("Lỗi khi book phòng");
      console.log(error);
    }
    finally
    {
      setIsProcessing(false);
    }
  };

  const handleDeniedBooking = async (id: string, reason: string) => {
    try {
      setIsProcessing(true);
      await stayService.declineUserBooking(id, reason);
      toast.success("Từ chối yêu cầu đặt phòng thành công");
      setNeedFetch(!needFetch);
      handleCloseReasonDialog(); 
    } catch (error) {
      toast.error("Lỗi khi từ chối đặt phòng");
      console.log(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenReasonDialog = (id: string) => {
    setSelectedId(id);
    setReasonDialogOpen(true);
  };
  
  const handleCloseReasonDialog = () => {
    setSelectedId(null);
    setReason("");
    setReasonDialogOpen(false);
  };

  const handleCompleteBooking = (id: string) => {

  }
  
  

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
              Tổng số yêu cầu đặt phòng
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ backgroundColor: '#4caf50', color: '#fff', width: 300 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {greenCardCount}
            </Typography>
            <Typography variant="body2" component="div">
              Đã hoàn thành
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ backgroundColor: '#f44336', color: '#fff', width: 300 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {redCardCount}
            </Typography>
            <Typography variant="body2" component="div">
              Đã từ chối
            </Typography>
          </CardContent>
        </Card>
      </Box>
    <Card>
    <CardHeader
      title={
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quản lý phòng đặt
        </Typography>
      }
      action={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Box mr={1}>
            <TextField
              label="Tìm kiếm"
              variant="outlined"
              size="small"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </Box>
          <Box>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={selectedStatus || 'both'}
                onChange={handleStatusFilterChange}
                label="Trạng thái"
              >
                <MenuItem value="both">Tất cả</MenuItem>
                <MenuItem value="true">Hoạt động</MenuItem>
                <MenuItem value="false">Bị chặn</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
      }
    />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã đặt phòng</TableCell>
              <TableCell>Thông tin người đặt</TableCell>
              <TableCell>Tên nơi ở</TableCell>
              <TableCell>Thông tin phòng đặt</TableCell>
              <TableCell align="right">Tổng giá</TableCell>
              <TableCell align="right">Trạng thái</TableCell> 
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBookings.map((booking) => {
              return (
                <TableRow hover key={booking.id}>
                  <TableCell>
                  <Typography  variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                    {booking.id}
                  </Typography>
                  </TableCell>
                  <TableCell>
                    <>
                        <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                          Họ tên:{booking.user.fullName}
                        </Typography>
                        <br></br>
                        <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                          Email:{booking.user.email}
                        </Typography>
                        <br></br>
                        <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                          Email:{booking.user.phone}
                        </Typography>
                    </>
                  </TableCell>
                  <TableCell>
                  <Typography  variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                    {booking.stay.name ?? ""}
                  </Typography>
                  </TableCell>
                  <TableCell>
                  {booking.bookingRoom && booking.bookingRoom.map((bookingRoom) => (
                    <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                      {bookingRoom.room.roomName ?? ""} x {bookingRoom.quantity}
                      <br />
                      {bookingRoom.voucher && (
                        <Typography variant="body1" color="text.primary" gutterBottom noWrap>
                          -{bookingRoom.voucher.name}
                        </Typography>
                      )}
                    </Typography>
                  ))}
                  </TableCell>
                  <TableCell align="right">
                  <Typography  variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                    {booking.totalPrice?.toLocaleString("vn")}
                  </Typography>
                  </TableCell>
                    <TableCell align="right">{getStatusLabel(booking.status ?? 0)}</TableCell>
                    <TableCell align="right">
                      {booking.status === 1 && (
                        <>
                          <Tooltip title="Chấp nhận đặt phòng" arrow>
                            <IconButton
                              sx={{
                                '&:hover': { background: theme.palette.success.light },
                                color: theme.palette.success.main,
                              }}
                              color="inherit"
                              size="small"
                              onClick={() => handleAcceptBooking(booking.id)}
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Từ chối yêu cầu đặt phòng" arrow>
                            <IconButton
                              sx={{
                                '&:hover': { background: theme.palette.success.light },
                                color: theme.palette.success.main,
                              }}
                              color="inherit"
                              size="small"
                              onClick={() => handleOpenReasonDialog(booking.id)}
                            >
                              <MeetingRoom fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      {booking.status === 4 && new Date() > new Date(booking.checkoutDate ?? "") && (
                            <Tooltip title="Xác nhận hoàn tất" arrow>
                              <IconButton
                                sx={{
                                  '&:hover': { background: theme.palette.success.light },
                                  color: theme.palette.success.main,
                                }}
                                color="inherit"
                                size="small"
                                onClick={() => handleCompleteBooking(booking.id)}
                              >
                                <EventAvailable fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
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
          count={bookings.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>

      <Dialog open={isImageDialogOpen} onClose={handleImageDialogClose}>
        <DialogContent>
          {selectedImage && <img src={selectedImage} alt="Full Size" style={{ maxWidth: '500px' }} />}
        </DialogContent>
      </Dialog>
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
      <Dialog open={reasonDialogOpen} onClose={handleCloseReasonDialog}>
        <DialogTitle>Xác nhận từ chối đặt phòng</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Lý do từ chối"
              variant="outlined"
              size="small"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReasonDialog}>Hủy</Button>
            <Button onClick={() => handleDeniedBooking(selectedId ?? "", reason)} color="error" variant="contained">
              Xác nhận
            </Button>
          </DialogActions>
      </Dialog>
    </div>
  );
};

export default OwnerBookingPageContent;
