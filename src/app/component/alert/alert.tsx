"use client"
import { Alert } from "react-bootstrap"

export function AlertNotification({ variant, heading, body }: { variant: string, heading: string, body: string }) {
    return (
        <div className="mt-4">
            <Alert variant={variant}>
                <Alert.Heading>{heading}</Alert.Heading>
                <p>
                    {body}
                </p>
            </Alert>
        </div>
    )

}