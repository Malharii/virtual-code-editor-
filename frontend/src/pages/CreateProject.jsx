import { Button, Layout, Typography } from "antd";
import { useCreateProject } from "../hooks/apis/mutaions/useCreateProject";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const layoutStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f8f9fa, #eef2f7)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'Inter', sans-serif",
};
const headerStyle = {
  background: "transparent",
  textAlign: "center",
  marginBottom: "1rem",
};
const contentBox = {
  background: "#ffffff",
  padding: "50px 40px",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  width: "400px",
  textAlign: "center",
};
const buttonStyle = {
  background: "linear-gradient(135deg, #1677ff, #69b1ff)",
  border: "none",
  borderRadius: "8px",
  padding: "10px 30px",
  fontSize: "1rem",
  fontWeight: 600,
  color: "#fff",
  boxShadow: "0 4px 10px rgba(22, 119, 255, 0.3)",
  transition: "all 0.3s ease",
};
const footerStyle = {
  background: "transparent",
  textAlign: "center",
  color: "#888",
  fontSize: "0.9rem",
  marginTop: "2rem",
};
export const CreateProject = () => {
  const { Header, Footer, Content } = Layout;
  const { createProjectMutation } = useCreateProject();
  const navigate = useNavigate();
  async function handleCreateProject() {
    console.log("Going to trigger the API");
    console.log(createProjectMutation, "create projeact");
    try {
      const response = await createProjectMutation();

      console.log("Now we should redirect to the editor");
      navigate(`/project/${response._id}`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <Title level={2} style={{ color: "#333", marginBottom: "0.5rem" }}>
          Create a New Project
        </Title>
        s
      </Header>{" "}
      <Content>
        {" "}
        <div style={contentBox}>
          {" "}
          <Title level={4} style={{ color: "#333", marginBottom: "1.5rem" }}>
            {" "}
            Ready to start your journey?
          </Title>{" "}
          <Button
            type="primary"
            size="large"
            style={buttonStyle}
            onClick={handleCreateProject}
            onMouseOver={(e) => (e.target.style.transform = "translateY(-2px)")}
            onMouseOut={(e) => (e.target.style.transform = "translateY(0)")}
          >
            Create Playground
          </Button>{" "}
        </div>{" "}
      </Content>{" "}
      <Footer style={footerStyle}>
        © 2025 Malhar Dev Studio — Crafted with ❤️ using React & Ant Design{" "}
      </Footer>
    </Layout>
  );
};
