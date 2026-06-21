import { Message } from "@/components/form-message";
import ForgotPasswordView from "./view";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return <ForgotPasswordView searchParams={searchParams} />;
}
