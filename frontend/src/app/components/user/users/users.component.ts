import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/user.interface';
import { UserData, UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  dataSource: MatTableDataSource<User>; 
  userData: UserData
  displayedColumns: string[] = ['id', 'name', 'username', 'email', 'role']
  filterValue: string 
  isLoading = true

  constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.initDataSource()
  }

  initDataSource() {
    this.userService.findAll(1, 10).subscribe(userData => {
      this.setTableData(userData)
      this.isLoading = false
    })
  }

  onPaginateChange(event: PageEvent) {
    this.isLoading = true
    let page = event.pageIndex + 1
    let size = event.pageSize
    this.userService.findAll(page, size, this.filterValue).subscribe(userData => {
      this.setTableData(userData)
      this.isLoading = false
    })
  }

  findByName(username: string) {
    this.isLoading = true
    setTimeout(() =>{ console.log('waiting')}, 2000)
    this.userService.findAll(1, 10, this.filterValue).subscribe(userData => {
      this.setTableData(userData)
      this.isLoading = false
    })
  }

  private setTableData(userData: UserData) {
    this.userData = userData
    this.dataSource = new MatTableDataSource(userData.items)
  }

  navigateToProfile(id: string) {
    this.router.navigate(['./' + id], { relativeTo: this.activatedRoute })
  }

}
