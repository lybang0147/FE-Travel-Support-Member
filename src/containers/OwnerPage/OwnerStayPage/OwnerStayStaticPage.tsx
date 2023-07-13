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

import {Chart, registerables } from 'chart.js'
import { Pie, Bar, Line } from 'react-chartjs-2';
import toast from 'react-hot-toast';
import Stay from 'models/stay';

interface RecentUsersTableProps {
  className?: string;
}

interface StayStaticData {
    totalRoom: number;
    totalStay: number;
    stayRating: { [key: string]: number };
    roomStay: { [key: string]: number };
    provinceStay: { [key: string]: number };
    stayType: { [key: string]: number };
  }

  interface BookingStaticData {
    stayRevenue: { [key: string]: number };
    dateRevenue: { [key: string]: number };
    totalBookingRequest: number;
    totalEarning: number;
    }

const OwnerStayStaticPage: FC<RecentUsersTableProps> = ({}) => {
  Chart.register(...registerables);
  const [stays, setStays] = useState<Stay[]>([]);
  const [needFetch, setNeedFetch] = useState<boolean>(false);
  const [stayStaticData, setStayStaticData] = useState<StayStaticData | null>(null);
  const [bookingStaticData, setBookingStaticData] = useState<BookingStaticData | null>(null);


  useEffect(() => {
    const fetchStays = async () => {
      try {
        const stayStaticData = await stayService.getOwnerStayStatic();
        const bookingStaticData = await stayService.getBookingStatic();
        setStayStaticData(stayStaticData);
        setBookingStaticData(bookingStaticData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStays();
  }, []);

  const generatePieChartDataset = (data: { [key: string]: number }) => {
    const labels = Object.keys(data);
    const values = Object.values(data);

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        },
      ],
    };
  };

  const generateBarChartDataset = (data: { [key: string]: number }) => {
    const labels = Object.keys(data);
    const values = Object.values(data);
    const barColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

    return {
      labels,
      datasets: [
        {
          label: 'Số lượng',
          data: values,
          backgroundColor: barColors.slice(0, values.length),
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const generateBarChartDatasetForBooking = (data: { [key: string]: number }) => {
    const labels = Object.keys(data);
    const values = Object.values(data);
    const barColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

    return {
      labels,
      datasets: [
        {
          label: 'Doanh thu',
          data: values,
          backgroundColor: barColors.slice(0, values.length),
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const generateLineChartDataset = (data: { [key: string]: number }) => {
    const labels = Object.keys(data);
    const values = Object.values(data);

    return {
        labels,
        datasets: [
            {
                label: 'Doanh thu',
                data: values,
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            },
        ],
    };
};


  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        precision: 0,
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
};


  const stayRatingPieData = stayStaticData ? generatePieChartDataset(stayStaticData.stayRating) : null;
  const roomStayBarData = stayStaticData ? generateBarChartDataset(stayStaticData.roomStay) : null;
  const provinceStayBarData = stayStaticData ? generateBarChartDataset(stayStaticData.provinceStay) : null;
  const stayTypePieData = stayStaticData ? generatePieChartDataset(stayStaticData.stayType) : null;
  const dateRevenueLineData = bookingStaticData ? generateLineChartDataset(bookingStaticData.dateRevenue) : null;
  const stayRevenueBarData = bookingStaticData ? generateBarChartDatasetForBooking(bookingStaticData.stayRevenue) : null;


  
  


  const blueCardCount = stayStaticData?.totalStay ?? 0;
  const greenCardCount = stayStaticData?.totalRoom ?? 0;
  const redCardCount = bookingStaticData?.totalBookingRequest ?? 0;
  const purpleCardCount = bookingStaticData?.totalEarning ?? 0;
  

  const theme = useTheme();
  return (
    <Card className='m-10'>
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
        <Card sx={{ backgroundColor: '#4caf50', color: '#fff', width: 300 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {greenCardCount}
            </Typography>
            <Typography variant="body2" component="div">
              Tổng số phòng
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ backgroundColor: '#f44336', color: '#fff', width: 300 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {redCardCount}
            </Typography>
            <Typography variant="body2" component="div">
              Tổng số lịch đặt phòng
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ backgroundColor: '#d6b5e7', color: '#fff', width: 300 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {purpleCardCount.toLocaleString('vn')} VNĐ
            </Typography>
            <Typography variant="body2" component="div">
              Tổng doanh thu
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Divider />
      <Box p={2} display="flex" justifyContent="space-between" flexWrap="wrap">
        <div style={{ height: 400, width: '45%', marginBottom: 64 }}>
          {stayRatingPieData && <Pie data={stayRatingPieData} options={pieChartOptions} />}
          <Typography variant="h6" align="center" fontWeight="bold" marginBottom={1}>
          Biểu đồ số lượng đánh giá theo khách sạn
          </Typography>
        </div>
        <div style={{ height: 400, width: '45%', marginBottom: 64 }}>
          {roomStayBarData && <Bar data={roomStayBarData} options={barChartOptions} />}
          <Typography variant="h6" align="center" fontWeight="bold" marginBottom={1}>
          Biểu đồ số phòng theo khách sạn
          </Typography>
        </div>
        <div style={{ height: 400, width: '45%', marginBottom: 32 }}>
          {provinceStayBarData && <Bar data={provinceStayBarData} options={barChartOptions} />}
          <Typography variant="h6" align="center" fontWeight="bold" marginBottom={1}>
          Biểu đồ số lượng khách sạn theo tỉnh
          </Typography>
        </div>
        <div style={{ height: 400, width: '45%', marginBottom: 32 }}>
          {stayTypePieData && <Pie data={stayTypePieData} options={pieChartOptions} />}
          <Typography variant="h6" align="center" fontWeight="bold" marginBottom={1}>
          Biểu đồ số lượng khách sạn theo loại
          </Typography>
        </div>
        <div style={{ height: 400, width: '90%', marginBottom: 32 }}>
            {dateRevenueLineData && <Line data={dateRevenueLineData} options={lineChartOptions} />}
            <Typography variant="h6" align="center" fontWeight="bold" marginBottom={1}>
                Doanh thu trong 30 ngày gần đây
            </Typography>
        </div>
        <div style={{ height: 400, width: '90%', marginBottom: 32 }}>
            {stayRevenueBarData && <Bar data={stayRevenueBarData} options={barChartOptions} />}
            <Typography variant="h6" align="center" fontWeight="bold" marginBottom={1}>
                Doanh thu theo khách sạn
            </Typography>
        </div>
      </Box>
    </div>
</Card>
  );
};

export default OwnerStayStaticPage;
