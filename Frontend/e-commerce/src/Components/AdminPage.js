import React from "react";
import logo from "../logo.png"; 

export const AdminPage = () => {
    return ( 
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.heading}>Welcome to Insta Mart Admin Page</h1>
                <p style={styles.description}>Insta Mart is your one-stop destination for all your online shopping needs. Explore a wide range of products including electronics, fashion, home essentials, and more!</p>
                <img src={logo} alt="Insta Mart Logo" style={styles.logo} />
                <div style={styles.additionalInfo}>
                    <h2 style={styles.subHeading}>About Insta Mart</h2>
                    <p>Insta Mart is committed to providing customers with a seamless shopping experience. Our platform offers a vast selection of products, secure payment options, and reliable delivery services.</p>
                    <h2 style={styles.subHeading}>Our Vision</h2>
                    <p>Our vision is to become the preferred online shopping destination for customers worldwide. We strive to continuously innovate and improve our services to meet the evolving needs of our customers.</p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: "90px 0 40px 0",
        textAlign: 'center',
    },
    content: {
        maxWidth: 600,
        margin: '0 auto',
    },
    heading: {
        fontSize: 32,
        marginBottom: 20,
        color: '#333',
    },
    description: {
        fontSize: 18,
        marginBottom: 30,
        lineHeight: 1.5,
    },
    logo: {
        maxWidth: 200,
        marginBottom: 20,
    },
    additionalInfo: {
        textAlign: 'left',
    },
    subHeading: {
        fontSize: 24,
        marginBottom: 10,
        color: '#333',
    },
};
