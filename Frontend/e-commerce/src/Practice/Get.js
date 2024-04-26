import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react"

export const Get=()=>{ 
    const [user,SetUser]=useState([]); 

    useEffect(()=>{
        const fetchUsers=async()=>{
            const request=await axios.get('https://localhost:7199/api/v1/Practice/Get Users');
            console.log(request);
            if(request.status==200)
            { 
                let data=request.data;
               // let v=data.filter(x=>x.gender=="Male");
               let v=data.sort((b,a)=>{
                if (a.gender < b.gender) return -1; 
                if (a.gender > b.gender) return 1;   

                if (b.firstName < a.firstName) return -1;
                if (b.firstName > a.firstName) return 1;
                return 0;
                
               })
                SetUser(v);

            }
        };
        fetchUsers();

    },[]);

    return (
    <>
    Hello 
    <TableContainer style={{padding:'0 50px 0 50px'}}>
        <Table  >
           
                <TableHead >
                    <TableRow  style={{backgroundColor:'lightblue'}} >
                        <TableCell style={{color:'red',fontStyle:'italic',fontWeight:'bolder',textAlign:'center'}}>First Name</TableCell>
                        <TableCell style={{color:'red',fontStyle:'italic',fontWeight:'bolder',textAlign:'center'}}>Last Name</TableCell>
                        <TableCell style={{color:'red',fontStyle:'italic',fontWeight:'bolder',textAlign:'center'}}>Gender</TableCell>
                    </TableRow>  
                </TableHead >
                <TableBody style={{textAlign:'center',backgroundColor:'beige'}}>
                    {user.length==0?(<div style={{color:'red'}}>NO data exist</div>):(
                    user.map(x=>(
                        
                        <TableRow key={x.id}   >
                            <TableCell style={{textAlign:'center'}}>{x.firstName}</TableCell>
                            <TableCell style={{textAlign:'center'}}>{x.lastName}</TableCell>
                            <TableCell style={{textAlign:'center'}}>{x.gender}</TableCell>
                        </TableRow>
                    )))}
                
            </TableBody>
        </Table>
    </TableContainer>
    </>
    )
}