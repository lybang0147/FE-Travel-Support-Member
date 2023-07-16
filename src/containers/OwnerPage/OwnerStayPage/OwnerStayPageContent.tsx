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
  SelectChangeEvent 
} from '@mui/material';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { AttachMoney, Close, Feedback, MeetingRoom } from '@mui/icons-material';
import toast from 'react-hot-toast';
import Stay from 'models/stay';

interface RecentUsersTableProps {
  className?: string;
}

interface Filters {
  status?: boolean;
}

const getStatusLabel = (status: boolean): JSX.Element => {
  const map: { [key: string]: { text: string; color: 'error' | 'success' } } = {
    false: {
      text: 'Tạm ngưng phục vụ',
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



const applyPagination = (stays: Stay[], page: number, limit: number): Stay[] => {
  return stays.slice(page * limit, page * limit + limit);
};

const OwnerStayPageContent: FC<RecentUsersTableProps> = ({}) => {
  const [reasonDialogOpen, setReasonDialogOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [banReason, setBanReason] = useState<string>('');
  const [stays, setStays] = useState<Stay[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [needFetch, setNeedFetch] = useState<boolean>(false);
  const [unbannedConfirmOpen, setUnbannedConfirmOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchKey, setSearchKey] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
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

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const fetchStays = async () => {
      try {
        const stayList = await stayService.getOwnerStay();
        setStays(stayList.content);
      } catch (error) {
        toast.error('Lỗi khi lấy dữ liệu khách sạn');
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

  const paginatedStays = applyPagination(stays, page, limit);

  const blueCardCount = stays.length;
  
  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    const parsedValue = selectedValue === "both" ? null : selectedValue === "true";
    setSelectedStatus(parsedValue !== null ? parsedValue.toString() : null);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDeleteStay = async (stayId: string) => {
    try
    {
      setIsProcessing(true);
      await stayService.deleteStay(stayId);
      setNeedFetch(!needFetch);
      toast.success("Ẩn/Hiện nơi ở thành công")
    }
    catch (error)
    {
      toast.error("Lỗi khi ẩn/hiện nơi ở")
    }
    finally
    {
      setIsProcessing(false);
    }
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
              Tổng số nơi ở
            </Typography>
          </CardContent>
        </Card>
      </Box>
    <Card>
    <CardHeader
      title={
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quản lý Khách sạn
        </Typography>
      }
      action={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/add-listing-1" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary" style={{ marginRight: '10px' }}>
              Thêm khách sạn
            </Button>
          </Link>
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
              <TableCell>Ảnh</TableCell>
              <TableCell>Tên hiển thị</TableCell>
              <TableCell>Loại khách sạn</TableCell>
              <TableCell align="right">Tỉnh</TableCell> 
              <TableCell align="right">Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedStays.map((stay) => {
              return (
                <TableRow hover key={stay.id}>
                  <TableCell>
                    <img
                      src={(stay.stayImage[0] && stay.stayImage[0].imgLink!=null) ? stay.stayImage[0].imgLink :''}
                      alt="Avatar"
                      style={{ width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer' }}
                      onClick={() => handleImageClick((stay.stayImage[0] && stay.stayImage[0].imgLink!=null) ? stay.stayImage[0].imgLink :'')}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                      {stay.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                      <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                        {stay.type}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                    <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                      {stay.province?.name}
                    </Typography>
                  </TableCell>
                    <TableCell align="right">{getStatusLabel(stay.hidden===false)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Thay đổi thông tin" arrow>
                        <IconButton
                          sx={{
                            '&:hover': { background: theme.palette.success.light },
                            color: theme.palette.success.main,
                          }}
                          color="inherit"
                          size="small"
                          onClick={() => window.location.href = `/owner/stay/edit/${stay.id}`}
                        >
                          <EditTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Quản lý phòng" arrow>
                        <IconButton
                          sx={{
                            '&:hover': { background: theme.palette.success.light },
                            color: theme.palette.success.main,
                          }}
                          color="inherit"
                          size="small"
                          onClick={() => window.location.href = `/owner/room/${stay.id}`}
                        >
                          <MeetingRoom fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Quản lý đánh giá" arrow>
                        <IconButton
                          sx={{
                            '&:hover': { background: theme.palette.success.light },
                            color: theme.palette.success.main,
                          }}
                          color="inherit"
                          size="small"
                          onClick={() => window.location.href = `/owner/review/${stay.id}`}
                        >
                          <Feedback fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={stay.hidden ? "Tiếp tục kinh doanh" : "Tạm ngưng phục vụ"}
                        arrow
                      >
                        <IconButton
                          sx={{
                            '&:hover': { background: theme.palette.success.light },
                            color: theme.palette.error.main,
                          }}
                          color="inherit"
                          size="small"
                          onClick={() => handleDeleteStay(stay.id ?? "")}
                        >
                          {stay.hidden ? <AttachMoney fontSize="small" /> : <Close fontSize="small" />}
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
          count={stays.length}
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

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Thêm khách sạn</DialogTitle>
        <DialogContent>
          <PageAddListing1></PageAddListing1>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Hủy bỏ</Button>
          <Button onClick={handleDialogClose} color="primary">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OwnerStayPageContent;
