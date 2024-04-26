import { Grid ,Button} from "@mui/material"
import { VendorStatisitics } from "./VendorStatistics"
import { useNavigate } from "react-router-dom"
import ArrowBack from '@mui/icons-material/ArrowBack';

export const  SpecificVendor=()=>{
    const navigate=useNavigate();
    return (
        <div style={{ padding: "80px 0 80px 0" ,position:'relative'}}>
    <Grid container alignItems="center">
        <Grid item xs={1}>
            <Button variant="outlined" startIcon={<ArrowBack   /> } style={{ position:'absolute', top:90, left: 110 }} onClick={() => navigate(-1)}></Button>
        </Grid>
        <Grid item xs={11}>
            <VendorStatisitics />
        </Grid>
    </Grid>
</div>

    )
}