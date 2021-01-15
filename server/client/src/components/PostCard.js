import React from 'react'
import { Button, Card, Icon, Image, Label } from 'semantic-ui-react'
import moment from 'moment';
import { Link } from 'react-router-dom';
const PostCard = ({post : {body, createdAt, id, username, likeCount, commentCount, likes}}) => {

    function likePost() {

    }

    function commentOnPost() {

    }

    return (
        <Card fluid>
            <Card.Content>
                <Image
                    floated="right"
                    size="mini"
                    src="https://react.semantic-ui.com/images/avatar/large/jenny.jpg"
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`}>
                    {moment(createdAt).fromNow(true)}
                </Card.Meta>
                <Card.Description>{body}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button as="div" labelPosition="right" onClick={likePost}>
                    <Button color="teal" basic>
                        <Icon name="heart" />
                    </Button>
                    <Label basic color="teal" pointing="left">
                        {likeCount}
                    </Label>
                </Button>
                <Button as="div" labelPosition="right" onClick={likePost}>
                    <Button color="blue" basic>
                        <Icon name="comment" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                        {commentCount}
                    </Label>
                </Button>
            </Card.Content>
        </Card>
    );
}

export default PostCard